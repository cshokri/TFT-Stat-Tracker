const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const options = {
    width: 1200,
    height: 900,
    show: false,
    minWidth: 1200,
  };
  mainWindow = new BrowserWindow(options);
  mainWindow.setMenuBarVisibility(false);

  const startURL = "http://localhost:3000";

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.on("ready", createWindow);
