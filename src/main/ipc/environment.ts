import { BrowserWindow, ipcMain } from 'electron';
import * as log from 'electron-log';

ipcMain.on('change-environment', async (event, target) => {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
        log.error(
            "Couldn't find main window when attempting to change environment.",
        );
        return;
    }

    try {
        switch (target) {
            case 'stage': {
                win.loadURL(process.env.CAELIX_STAGE_URL || 'https://stage.caelix.it');
                break;
            }
            case 'production': {
                win.loadURL(process.env.CAELIX_APP_URL || 'https://caelix.it');
                break;
            }
            case 'local': {
                win.loadURL('http://localhost:5173');
                break;
            }
        }
    } catch (error) {
        let message = 'Unknown';
        if (error instanceof Error) {
            message = error.message;
        }
        log.error(`Failed to change environment: ${message}`);
    }
});
