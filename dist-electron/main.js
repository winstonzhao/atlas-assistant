const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { loadSettings, saveSettings } = require('./store');
const { initializeAnthropicClient, sendMessage } = require('./anthropicService');
const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    if (isDev) {
        // In development, load from the Vite dev server
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    }
    else {
        // In production, load the index.html file
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    // Open DevTools in development
    if (isDev) {
        win.webContents.openDevTools();
    }
}
// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    // Set up IPC handlers
    ipcMain.handle('get-settings', () => {
        return loadSettings();
    });
    ipcMain.handle('save-settings', (_, settings) => {
        saveSettings(settings);
        return loadSettings();
    });
    // Anthropic API handlers
    ipcMain.handle('initialize-anthropic', () => {
        return initializeAnthropicClient();
    });
    ipcMain.handle('send-message', async (_, messages) => {
        return sendMessage(messages);
    });
    createWindow();
});
// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map