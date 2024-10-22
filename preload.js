const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    verifyMinecraft: () => ipcRenderer.invoke('verify-minecraft'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    loadSettings: () => ipcRenderer.invoke('load-settings'),
    launchMinecraft: (settings) => ipcRenderer.invoke('launch-minecraft', settings)
});
