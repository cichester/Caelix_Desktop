import { app, BrowserWindow, dialog, Menu, MenuItem, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import { loadConfig, saveConfig } from '../config';

const appVersionLabel = () => `Caelix Desktop v${app.getVersion()}`;

let isManualCheck = false;

autoUpdater.on('update-not-available', () => {
    if (!isManualCheck) {
        return;
    }

    isManualCheck = false;

    const config = loadConfig();
    const channelLabel =
        config?.channel === 'beta' ? 'beta version' : 'version';

    dialog.showMessageBox({
        title: 'No Updates Available',
        message: "You're up to date!",
        detail: `${appVersionLabel()} is the latest ${channelLabel}.`,
        buttons: ['OK'],
    });
});

autoUpdater.on('update-available', (info) => {
    isManualCheck = false;
    dialog.showMessageBox({
        type: 'info',
        title: 'Aggiornamento Rilevato',
        message: `È disponibile la nuova versione v${info.version}`,
        detail: "Download dell'aggiornamento in corso in background...",
        buttons: ['OK'],
    });
});

autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Aggiornamento Obbligatorio',
        message: `Versione v${info.version} pronta all'installazione`,
        detail: "Per garantire la piena compatibilità con i server di Caelix, l'aggiornamento è obbligatorio. L'app verrà ora riavviata.",
        buttons: ['Riavvia e Aggiorna Ora'],
        noLink: true,
    }).then(() => {
        autoUpdater.quitAndInstall();
    });
});

autoUpdater.on('error', (error) => {
    if (!isManualCheck) {
        return;
    }

    isManualCheck = false;

    dialog.showMessageBox({
        type: 'error',
        title: 'Update Check Failed',
        message: 'Could not check for updates.',
        detail:
            error?.message ||
            'An unknown error occurred. Please try again later.',
        buttons: ['OK'],
    });
});

export const buildMenu = (): void => {
    const isMac = process.platform === 'darwin';

    const config = loadConfig();

    const versionItem = new MenuItem({
        label: appVersionLabel(),
        enabled: false,
    });

    const checkForUpdates = new MenuItem({
        label: 'Check for Updates...',
        click: async () => {
            isManualCheck = true;
            const result = await autoUpdater.checkForUpdatesAndNotify();
            if (result === null && isManualCheck) {
                isManualCheck = false;
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Update Check Unavailable',
                    message: 'Could not check for updates.',
                    detail: 'Please check your connection and try again later.',
                    buttons: ['OK'],
                });
            }
        },
    });

    const stableChannel = !config
        ? null
        : new MenuItem({
              label: 'Stable Channel',
              type: 'radio',
              checked: config.channel === 'latest',
              click: () => {
                  config.channel = 'latest';
                  saveConfig(config);
                  autoUpdater.channel = 'latest';
                  autoUpdater.checkForUpdatesAndNotify();
              },
          });

    const betaChannel = !config
        ? null
        : new MenuItem({
              label: 'Beta Channel (Danger Zone)',
              type: 'radio',
              checked: config.channel === 'beta',
              click: () => {
                  config.channel = 'beta';
                  saveConfig(config);
                  autoUpdater.channel = 'beta';
                  autoUpdater.checkForUpdatesAndNotify();
              },
          });

    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { role: 'about' },
                          { type: 'separator' },
                          versionItem,
                          checkForUpdates,
                          stableChannel,
                          betaChannel,
                          { type: 'separator' },
                          { role: 'services' },
                          { type: 'separator' },
                          { role: 'hide' },
                          { role: 'hideothers' },
                          { role: 'unhide' },
                          { type: 'separator' },
                          { role: 'quit' },
                      ],
                  },
              ]
            : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: isMac
                ? [{ role: 'close' }]
                : [
                      versionItem,
                      checkForUpdates,
                      stableChannel,
                      betaChannel,
                      { role: 'quit' },
                  ],
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                          { role: 'pasteAndMatchStyle' },
                          { role: 'delete' },
                          { role: 'selectAll' },
                          { type: 'separator' },
                          {
                              label: 'Speech',
                              submenu: [
                                  { role: 'startSpeaking' },
                                  { role: 'stopSpeaking' },
                              ],
                          },
                      ]
                    : [
                          { role: 'delete' },
                          { type: 'separator' },
                          { role: 'selectAll' },
                      ]),
            ],
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
                {
                    label: 'Resize Window',
                    submenu: [
                        {
                            label: '720p',
                            click: () => {
                                BrowserWindow.getFocusedWindow()?.setSize(
                                    1280,
                                    720,
                                    true,
                                );
                            },
                        },
                        {
                            label: '1080p',
                            click: () => {
                                BrowserWindow.getFocusedWindow()?.setSize(
                                    1920,
                                    1080,
                                    true,
                                );
                            },
                        },
                        {
                            label: '1440p',
                            click: () => {
                                BrowserWindow.getFocusedWindow()?.setSize(
                                    2560,
                                    1440,
                                    true,
                                );
                            },
                        },
                        {
                            label: '4K',
                            click: () => {
                                BrowserWindow.getFocusedWindow()?.setSize(
                                    3840,
                                    2160,
                                    true,
                                );
                            },
                        },
                    ],
                },
            ],
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [
                          { type: 'separator' },
                          { role: 'front' },
                          { type: 'separator' },
                          { role: 'window' },
                      ]
                    : [{ role: 'close' }]),
            ],
        },
        {
            role: 'help',
            submenu: [
                versionItem,
                checkForUpdates,
                { type: 'separator' },
                ...(stableChannel && betaChannel ? [stableChannel, betaChannel, { type: 'separator' }] : []),
                {
                    label: 'Sito ufficiale',
                    click: async () => {
                        await shell.openExternal('https://caelix.it');
                    },
                },
            ],
        },
    ];

    // @ts-expect-error Copied from docs
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};
