import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mainProcess', {
  look: function look() {
    return ipcRenderer.invoke('look');
  }
});