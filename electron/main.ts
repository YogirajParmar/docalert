import { app, BrowserWindow, screen, ipcMain } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import * as dotenv from "dotenv";
import * as remoteMain from "@electron/remote/main";

// Load environment variables
dotenv.config();

// Initialize remote module
remoteMain.initialize();

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const windowWidth = Math.floor(width * 0.9);
  const windowHeight = Math.floor(height * 0.9);

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      nodeIntegration: false, // Security: disable nodeIntegration
      contextIsolation: true, // Security: enable contextIsolation
      preload: path.join(__dirname, 'preload.js') // Use our preload script
    },
    frame: false,
  });

  // Enable remote module for this window
  remoteMain.enable(win.webContents);

  // In development, use the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5000');
    win.webContents.openDevTools();
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '../dist/public/index.html'));
  }

  // Window control events
  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    win.close();
  });

  // Auto-updater setup
  autoUpdater.checkForUpdatesAndNotify();
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

// Auto-updater events
autoUpdater.on('update-available', () => {
  console.log('Update available');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded');
});

autoUpdater.on('error', (err) => {
  console.error('Error in auto-updater:', err);
});