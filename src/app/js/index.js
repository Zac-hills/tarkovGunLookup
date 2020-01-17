const { app, BrowserWindow, ipcMain } = require("electron");

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    backgroundColor: "#2e2c29",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("src/app/html/index.html");
  //remove windows
  win.removeMenu();
  win.webContents.openDevTools();
  ipcMain.on("exit-button", function(event, arg) {
    win.close();
  });
  ipcMain.on("maximize-button", function(event, arg) {
    if (win.isMaximized()) {
      win.unmaximize();
      return;
    }
    win.maximize();
  });
  ipcMain.on("minimize-button", function(event, arg) {
    win.minimize();
  });
}

app.on("ready", createWindow);
