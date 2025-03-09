import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    minimize: () => ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window'),
    handleLoginSuccess: (callback: () => void) => {
      ipcRenderer.on('login-success', callback);
    },
    removeLoginSuccessListener: (callback: () => void) => {
      ipcRenderer.removeListener('login-success', callback);
    }
  }
);
