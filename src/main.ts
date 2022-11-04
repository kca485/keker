import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent, shell } from 'electron';
import * as path from 'path';
import Keker from './keker';

function handleLook(e: IpcMainInvokeEvent, data: string[]) {
  const urls = data.map((datum) => ({ url: datum }));
  const keker = new Keker(urls);
  return keker.look();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.loadFile(path.join(__dirname, '../index.html'));
}

app.whenReady().then(() => {
  ipcMain.handle('look', handleLook);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

