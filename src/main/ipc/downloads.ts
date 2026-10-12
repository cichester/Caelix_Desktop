import { BrowserWindow, ipcMain } from 'electron';
import { download } from 'electron-dl';
import * as log from 'electron-log';

ipcMain.on('download-file', async (event, args) => {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
        log.error(
            "Couldn't find main window when attempting to download a file.",
        );
        return;
    }

    try {
        await download(win, args.url, {
            filename: args.filename,
            openFolderWhenDone: true,
        });
    } catch (error) {
        let message = 'Unknown';
        if (error instanceof Error) {
            message = error.message;
        }
        log.error(`Failed to download file: ${message}`);
    }
});
