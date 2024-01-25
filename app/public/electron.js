const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Correct this path if necessary
      nodeIntegration: true,
      contextIsolation: false // Remember to check security settings
    }
  });

  // Point to the correct path of the index.html in the build directory
  mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
}

function startBackend() {
  // Determine the correct path to main.exe based on whether the app is packaged
  const pathToBackend = app.isPackaged
    ? path.join(process.resourcesPath, 'backend/main.exe') // When packaged
    : path.join(__dirname, '../Backend/dist/main.exe');     // When running in development

  console.log('Attempting to start backend from:', pathToBackend);

  // For Windows, the detached option allows the subprocess to continue running after the parent exits
  const options = process.platform === "win32" ? { detached: true, stdio: 'inherit' } : { stdio: 'inherit' };

  if (fs.existsSync(pathToBackend)) {
    backendProcess = spawn(pathToBackend, options);

    backendProcess.on('error', (err) => {
      console.error('Failed to start backend process:', err);
    });

    backendProcess.on('close', (code, signal) => {
      console.log(`Backend process exited with code ${code} and signal ${signal}`);
    });

    // If on Windows, prevent the Node.js process from waiting for the subprocess to exit
    if (process.platform === "win32") {
      backendProcess.unref();
    }
  } else {
    console.error('Backend executable not found at:', pathToBackend);
  }
}

app.whenReady().then(() => {
  createWindow();
  startBackend();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  // Ensure that we kill the backend process when the app is about to close
  if (backendProcess) {
    backendProcess.kill('SIGINT'); // Send an interrupt signal, change as needed for your backend
  }
});
