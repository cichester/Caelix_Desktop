import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('discord', {
    setHomeActivity: () => {
        ipcRenderer.send('discord-rpc', ['home']);
    },
    setGameActivity: (gameName: string) => {
        ipcRenderer.send('discord-rpc', ['game', gameName]);
    },
    clearActivity: () => {
        ipcRenderer.send('discord-rpc', ['clear']);
    },
});

contextBridge.exposeInMainWorld('downloads', {
    downloadFile: (url: string, filename: string) => {
        ipcRenderer.send('download-file', { url, filename });
    },
});

contextBridge.exposeInMainWorld('clientEnvironment', {
    changeEnvironment: (target: string) => {
        ipcRenderer.send('change-environment', target);
    },
});

// Buffer callback URLs that arrive from main before the renderer has called
// onDiscordCallbackUrl, so deep links delivered during page load or during
// a re-subscription gap are not lost. The renderer drains the buffer the
// first time it subscribes.
const bufferedCallbackUrls: string[] = [];
const callbackListeners = new Set<(url: string) => void>();

ipcRenderer.on('oauth:discord:callback-url', (_event, url: string) => {
    if (callbackListeners.size === 0) {
        bufferedCallbackUrls.push(url);
        return;
    }

    for (const listener of callbackListeners) {
        listener(url);
    }
});

const authBridge = {
    openDiscordAuthInBrowser: (args: { authorizeUrl: string }) =>
        ipcRenderer.invoke('oauth:discord:open-in-browser', args),
    onDiscordCallbackUrl: (callback: (url: string) => void) => {
        callbackListeners.add(callback);

        while (bufferedCallbackUrls.length > 0) {
            const url = bufferedCallbackUrls.shift();
            if (url !== undefined) {
                callback(url);
            }
        }

        return () => {
            callbackListeners.delete(callback);
        };
    },
};

contextBridge.exposeInMainWorld('caelixAuth', authBridge);

