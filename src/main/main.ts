import '../sentry';

import { app, BrowserWindow, screen, shell } from 'electron';
import electronDl from 'electron-dl';
import * as log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { platform } from 'os';
import * as path from 'path';
import { loadConfig } from '../config';
import {
    findCallbackUrlInArgv,
    flushPendingCallbackUrl,
    handleProtocolUrl,
    initializeDiscord,
    initializeDiscordOAuth,
} from './ipc';
import { buildMenu } from './menu';

const isDevelopment = import.meta.env.DEV;

// Shared window configuration
const TITLE_BAR_STYLE = platform() === 'darwin' ? 'hidden' : 'default';
const AUTO_HIDE_MENU_BAR = true;
const WINDOW_BACKGROUND_COLOR = '#0C0B10';


// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

// A second launch (e.g. from clicking an alchemyrpg:// deep link while the
// app is already running) should focus the existing instance instead of
// spawning a duplicate. On macOS the OS handles this via open-url; on
// Windows and Linux we rely on the single-instance lock + second-instance
// event to receive the argv of the second launch.
const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
    // Hard exit: app.quit() would be async, leaving the secondary instance
    // to keep evaluating this module (electronDl, event registrations,
    // auto-updater setup) until the quit sequence caught up. The
    // second-instance event has already fired on the primary instance by
    // the time requestSingleInstanceLock returned, so nothing more needs
    // to run in this duplicate process. app.exit is synchronous.
    app.exit(0);
}

// Initialize electron-dl download manager for all windows.
electronDl();

// Strip "Electron/x.y.z" from User-Agent to avoid Google 403 disallowed_useragent during OAuth
app.userAgentFallback = app.userAgentFallback.replace(/Electron\/[0-9\.]+\s*/, '');

const focusMainWindow = () => {
    if (!mainWindow) {
        return;
    }

    if (mainWindow.isMinimized()) {
        mainWindow.restore();
    }

    mainWindow.focus();
};

app.on('second-instance', (_event, argv) => {
    const callbackUrl = findCallbackUrlInArgv(argv);
    if (callbackUrl) {
        handleProtocolUrl(callbackUrl);
    }

    focusMainWindow();
});

app.on('open-url', (event, url) => {
    event.preventDefault();
    handleProtocolUrl(url);
    focusMainWindow();
});

const createMainWindow = (): BrowserWindow => {
    const display = screen.getPrimaryDisplay();

    const width = Math.floor(display.bounds.width * 0.8);
    const height = Math.floor(display.bounds.height * 0.8);
    const x = display.bounds.width / 2 - width / 2;
    const y = display.bounds.height / 2 - height / 2;

    const preload = path.join(__dirname, '../preload/index.js');

    const window = new BrowserWindow({
        webPreferences: {
            preload,
            backgroundThrottling: false,
            sandbox: false,
        },
        titleBarStyle: TITLE_BAR_STYLE,
        // On Electron >= 15, the titleBarStyle now carries through on Windows.
        // We can use the following to override the default title bar style,
        // but it doesn't look great.
        // titleBarOverlay: {
        //     color: 'transparent',
        //     symbolColor: '#8A6C3C',
        // },
        title: 'Caelix',
        icon: path.join(__dirname, '../../icon-source/icon.png'),
        autoHideMenuBar: AUTO_HIDE_MENU_BAR,
        backgroundColor: WINDOW_BACKGROUND_COLOR,
        center: true,
        minWidth: 1000,
        width,
        height,
        x,
        y,
    });

    const targetUrl = isDevelopment
        ? (process.env.CAELIX_DEV_URL || 'http://localhost:5173')
        : (process.env.CAELIX_APP_URL || 'https://caelix.it');

    const loadTarget = () => {
        window.loadURL(targetUrl).catch((err) => {
            log.warn(`Attesa del frontend su ${targetUrl}... (${err.message})`);
        });
    };

    loadTarget();

    if (isDevelopment) {
        window.webContents.openDevTools();

        window.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
            log.warn(`Caricamento fallito (${errorCode}: ${errorDescription}), nuovo tentativo tra 1.5s...`);
            setTimeout(() => {
                if (!window.isDestroyed()) {
                    loadTarget();
                }
            }, 1500);
        });
    }

    window.webContents.once('did-finish-load', () => {
        flushPendingCallbackUrl(window.webContents);
    });

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    window.webContents.on('will-navigate', (event, url) => {
        if (
            url.startsWith('https://caelix.it') ||
            url.startsWith('https://app.caelix.it') ||
            url.startsWith('http://localhost:5173') ||
            url.startsWith('http://127.0.0.1:5173') ||
            url.startsWith('http://localhost:3000')
        ) {
            return;
        }

        event.preventDefault();
        shell.openExternal(url);
    });

    window.webContents.setWindowOpenHandler(({ url }) => {
        // Allow modal pop-outs to open in a new Alchemy window. Other types of
        if (url.includes('/popout/')) {
            const mainBounds = window.getBounds();

            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    title: 'Caelix',
                    icon: path.join(__dirname, '../../icon-source/icon.png'),
                    titleBarStyle: TITLE_BAR_STYLE,
                    autoHideMenuBar: AUTO_HIDE_MENU_BAR,
                    x: mainBounds.x + 60,
                    y: mainBounds.y + 60,
                    width: 1100,
                    height: 850,
                    minWidth: 480,
                    minHeight: 360,
                    backgroundColor: WINDOW_BACKGROUND_COLOR,
                    webPreferences: {
                        preload,
                        backgroundThrottling: false,
                        sandbox: false,
                    },
                },
            };
        }

        // Allow Google Identity Services popup
        if (url.startsWith('https://accounts.google.com/')) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    title: 'Accedi con Google',
                    icon: path.join(__dirname, '../../icon-source/icon.png'),
                    width: 520,
                    height: 680,
                    autoHideMenuBar: true,
                    backgroundColor: WINDOW_BACKGROUND_COLOR,
                    webPreferences: {
                        preload,
                        backgroundThrottling: false,
                        sandbox: false,
                    },
                },
            };
        }

        shell.openExternal(url);
        return { action: 'deny' };
    });

    window.webContents.on('did-create-window', (childWindow) => {
        childWindow.webContents.on('will-navigate', (event, childUrl) => {
            if (
                childUrl.startsWith('https://caelix.it') ||
                childUrl.startsWith('https://app.caelix.it') ||
                childUrl.startsWith('http://localhost:5173') ||
                childUrl.startsWith('http://127.0.0.1:5173') ||
                childUrl.startsWith('http://localhost:3000') ||
                childUrl.startsWith('https://accounts.google.com')
            ) {
                return;
            }

            event.preventDefault();
            shell.openExternal(childUrl);
        });
    });

    window.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            // This function is called before any web request is sent.
            // If the request is to something like D&D Beyond, we hack around
            // CORS by manipulating the request headers.
            // Inspired by https://pratikpc.medium.com/bypassing-cors-with-electron-ab7eaf331605
            if (!shouldIgnoreCors(details.url)) {
                callback({ requestHeaders: details.requestHeaders });
                return;
            }

            const { requestHeaders } = details;
            upsertHeader(requestHeaders, 'Access-Control-Allow-Origin', ['*']);

            callback({ requestHeaders });
        },
    );

    window.webContents.session.webRequest.onHeadersReceived(
        (details, callback) => {
            // This function is called when a web request is received.
            // If the request was to something like D&D Beyond, we hack around
            // CORS by manipulating the response headers so the browser doesn't
            // know about the CORS violation.
            // Inspired by https://pratikpc.medium.com/bypassing-cors-with-electron-ab7eaf331605
            if (!shouldIgnoreCors(details.url)) {
                callback({ responseHeaders: details.responseHeaders });
                return;
            }

            const { responseHeaders } = details;
            upsertHeader(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
            upsertHeader(responseHeaders, 'Access-Control-Allow-Headers', [
                '*',
            ]);

            callback({
                responseHeaders,
            });
        },
    );

    return window;
};

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', async () => {
    autoUpdater.logger = log;

    const config = loadConfig();
    autoUpdater.channel = config?.channel || null;

    buildMenu();

    autoUpdater.checkForUpdatesAndNotify();

    initializeDiscordOAuth();

    // Cold start on Windows and Linux: a deep link that launches the app
    // arrives as an argv entry. macOS delivers the same information through
    // the open-url event, which Electron buffers until a handler is
    // registered, so we do not need to scan argv there.
    if (platform() !== 'darwin') {
        const callbackUrl = findCallbackUrlInArgv(process.argv);
        if (callbackUrl) {
            handleProtocolUrl(callbackUrl);
        }
    }

    mainWindow = createMainWindow();

    await initializeDiscord();
});

const shouldIgnoreCors = (url: string) => {
    return url.includes('dndbeyond.com');
};

const upsertHeader = (
    headers: Record<string, string | string[]> | undefined,
    keyToChange: string,
    value: string | string[],
) => {
    if (!headers) {
        return;
    }

    const lowercaseKey = keyToChange.toLowerCase();

    for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === lowercaseKey) {
            // If the key already exists, reassign it.
            headers[key] = value;
            return;
        }
    }

    // If the key does not already exist, add it.
    headers[keyToChange] = value;
};
