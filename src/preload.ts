import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mainProcess', {
  look: function look(urls: string[]) {
    return ipcRenderer.invoke('look', urls);
  }
});