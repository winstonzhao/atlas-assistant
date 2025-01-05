const { app, BrowserWindow } = require('electron')
const path = require('path')

const isDev = process.env.VITE_DEV_SERVER_URL !== undefined

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (isDev) {
    // In development, load from the Vite dev server
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    // In production, load the index.html file
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Open DevTools in development
  if (isDev) {
    win.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
