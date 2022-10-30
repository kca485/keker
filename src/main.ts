import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import Keker from './keker';

const keker = new Keker([
  { url: 'https://lpse.gunungkidulkab.go.id/eproc4' },
]);
keker.look();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
}

app.whenReady().then(() => {
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

