import { execFile } from 'child_process';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as log from 'electron-log';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export const PROTOCOL_SCHEME = 'caelix';
const DISCORD_CALLBACK_HOST = 'discord';
const DISCORD_CALLBACK_PATH = '/callback';
const CALLBACK_URL_CHANNEL = 'oauth:discord:callback-url';
const DISCORD_AUTHORIZE_ORIGIN = 'https://discord.com';
const DISCORD_AUTHORIZE_PATH = '/oauth2/authorize';
const LINUX_SCHEME_HANDLER_DESKTOP_FILE = 'caelix-scheme.desktop';
const LINUX_MIME_TYPE = `x-scheme-handler/${PROTOCOL_SCHEME}`;

// Allowed `redirect_uri` values when forwarding an authorize URL to the
// system browser.
const ALLOWED_AUTHORIZE_REDIRECT_URIS: ReadonlySet<string> = new Set([
    'https://caelix.it/discord/callback',
    'https://app.caelix.it/discord/callback',
    'http://localhost:5173/discord/callback',
    'http://localhost:5173/callback',
    'http://127.0.0.1:5173/callback',
]);


/**
 * Strips query string and fragment from a URL for logging. OAuth callback
 * URLs carry `code`/`state` values that we must not commit to disk logs.
 */
const sanitizeUrlForLog = (rawUrl: string): string => {
    try {
        const parsed = new URL(rawUrl);
        return `${parsed.origin}${parsed.pathname}`;
    } catch {
        return '<unparseable-url>';
    }
};

const isDiscordAuthorizeUrl = (rawUrl: string): boolean => {
    try {
        const parsed = new URL(rawUrl);

        if (
            parsed.origin !== DISCORD_AUTHORIZE_ORIGIN ||
            parsed.pathname !== DISCORD_AUTHORIZE_PATH
        ) {
            return false;
        }

        const redirectUri = parsed.searchParams.get('redirect_uri');
        if (!redirectUri || !ALLOWED_AUTHORIZE_REDIRECT_URIS.has(redirectUri)) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
};

/**
 * Buffered callback URL when a deep link arrives before any renderer window
 * is ready to receive it (cold start scenario). Flushed when a window
 * finishes loading.
 */
let pendingCallbackUrl: string | null = null;

const isDiscordCallbackUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url);
        return (
            parsed.protocol === `${PROTOCOL_SCHEME}:` &&
            parsed.hostname === DISCORD_CALLBACK_HOST &&
            parsed.pathname === DISCORD_CALLBACK_PATH
        );
    } catch {
        return false;
    }
};

const broadcastCallbackUrl = (url: string): void => {
    const windows = BrowserWindow.getAllWindows();

    if (windows.length === 0) {
        pendingCallbackUrl = url;
        return;
    }

    for (const window of windows) {
        window.webContents.send(CALLBACK_URL_CHANNEL, url);
    }
};

/**
 * Entry point for URLs coming from the OS (open-url on macOS, argv on
 * Windows/Linux, second-instance relaunches). Filters for our Discord
 * callback and forwards to the renderer.
 */
export const handleProtocolUrl = (url: string): void => {
    if (!isDiscordCallbackUrl(url)) {
        log.info(
            `Ignoring non-Discord protocol URL: ${sanitizeUrlForLog(url)}`,
        );
        return;
    }

    broadcastCallbackUrl(url);
};

/**
 * Finds a Discord callback URL among argv entries. Used for Windows/Linux
 * cold start and second-instance relaunch.
 */
export const findCallbackUrlInArgv = (
    argv: readonly string[],
): string | null => {
    for (const arg of argv) {
        if (typeof arg === 'string' && isDiscordCallbackUrl(arg)) {
            return arg;
        }
    }

    return null;
};

/**
 * Flushes any buffered callback URL to the given webContents. Should be
 * called after a newly created window finishes loading so cold-start
 * deep links that arrived before any window existed still make it through.
 */
export const flushPendingCallbackUrl = (
    webContents: Electron.WebContents,
): void => {
    if (!pendingCallbackUrl) {
        return;
    }

    webContents.send(CALLBACK_URL_CHANNEL, pendingCallbackUrl);
    pendingCallbackUrl = null;
};

/**
 * Escapes a path for use as an argument in a Desktop Entry `Exec=` line.
 * Per the spec, inside double quotes we must backslash-escape backslash,
 * dollar sign, backtick, and double quote. Literal `%` must be doubled so
 * it is not interpreted as a field code (e.g. `%u`).
 *
 * @see https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#exec-variables
 */
const quoteDesktopExecArg = (arg: string): string => {
    const escaped = arg
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\$/g, '\\$')
        .replace(/`/g, '\\`')
        .replace(/%/g, '%%');
    return `"${escaped}"`;
};

/**
 * AppImage-specific scheme registration for Linux. `setAsDefaultProtocolClient`
 * registers `process.execPath`, which for AppImage builds is the temporary
 * `/tmp/.mount_...` path and therefore becomes stale the moment the AppImage
 * unmounts. Additionally AppImages never run an installer, so the .desktop
 * file bundled by electron-builder never ends up in the user's applications
 * directory. Write our own scheme-handler .desktop file pointing at the
 * stable `APPIMAGE` path so xdg-open can find us.
 */
const registerLinuxAppImageSchemeHandler = (): void => {
    if (process.platform !== 'linux') {
        return;
    }

    const appImagePath = process.env.APPIMAGE;
    if (!appImagePath) {
        return;
    }

    const applicationsDir = path.join(
        os.homedir(),
        '.local',
        'share',
        'applications',
    );
    const desktopFilePath = path.join(
        applicationsDir,
        LINUX_SCHEME_HANDLER_DESKTOP_FILE,
    );
    const desktopFileContent = `[Desktop Entry]
Type=Application
Name=Caelix (${PROTOCOL_SCHEME}:// handler)
Exec=${quoteDesktopExecArg(appImagePath)} %u
Terminal=false
NoDisplay=true
MimeType=${LINUX_MIME_TYPE};
`;

    try {
        fs.mkdirSync(applicationsDir, { recursive: true });
        fs.writeFileSync(desktopFilePath, desktopFileContent);
    } catch (err) {
        log.warn(
            `Failed to write ${PROTOCOL_SCHEME}:// handler .desktop file: ${String(
                err,
            )}`,
        );
        return;
    }

    execFile('update-desktop-database', [applicationsDir], (err) => {
        if (err) {
            log.warn(
                `update-desktop-database failed for ${PROTOCOL_SCHEME}:// handler: ${String(
                    err,
                )}`,
            );
        }
    });

    execFile(
        'xdg-mime',
        ['default', LINUX_SCHEME_HANDLER_DESKTOP_FILE, LINUX_MIME_TYPE],
        (err) => {
            if (err) {
                log.warn(
                    `xdg-mime default failed for ${LINUX_MIME_TYPE}: ${String(
                        err,
                    )}`,
                );
            }
        },
    );
};

export const initializeDiscordOAuth = (): void => {
    if (!app.isDefaultProtocolClient(PROTOCOL_SCHEME)) {
        const registered = app.setAsDefaultProtocolClient(PROTOCOL_SCHEME);
        if (!registered) {
            log.warn(
                `Failed to register ${PROTOCOL_SCHEME}:// as default protocol client`,
            );
        }
    }

    registerLinuxAppImageSchemeHandler();

    ipcMain.removeHandler('oauth:discord:open-in-browser');
    ipcMain.handle(
        'oauth:discord:open-in-browser',
        async (_event, args: { authorizeUrl?: string }): Promise<void> => {
            if (!args || typeof args.authorizeUrl !== 'string') {
                log.warn('oauth:discord:open-in-browser received invalid args');
                return;
            }

            // Only forward URLs pointed at Discord's authorize endpoint so a
            // compromised renderer (XSS, supply-chain) cannot turn this
            // channel into an arbitrary shell.openExternal call.
            if (!isDiscordAuthorizeUrl(args.authorizeUrl)) {
                log.warn(
                    `oauth:discord:open-in-browser blocked non-Discord URL: ${sanitizeUrlForLog(
                        args.authorizeUrl,
                    )}`,
                );
                return;
            }

            await shell.openExternal(args.authorizeUrl);
        },
    );
};
