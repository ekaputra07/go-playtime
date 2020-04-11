const electron = require("electron");
const { app, BrowserWindow, Tray } = electron;
const path = require("path");

const width = 600;
const height = 600;
var window, tray;

function createWindow(url) {
  window = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
    },
  });
  window.loadURL(url);
  window.hide();
  window.on("blur", () => {
    window.hide();
  });
}

function trayOnClick() {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
}

function alignWindow() {
  const position = calculateWindowPosition();
  window.setBounds({
    width: width,
    height: height,
    x: position.x,
    y: position.y,
  });
}

function showWindow() {
  alignWindow();
  window.show();
}

function calculateWindowPosition() {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Mac OS: set window position below the tray icon
  if (process.platform === "darwin") {
    return {
      x: trayBounds.x + trayBounds.width / 2 - window.getBounds().width / 2,
      y: trayBounds.y,
    };
  }
  // others: return its default position
  return windowBounds;
}

app.setAboutPanelOptions({
  applicationName: "Go Playtime",
  applicationVersion: "0.0.1",
  version: "1",
});
app.on("ready", () => {
  createWindow("https://play.golang.org");

  tray = new Tray(path.join(__dirname, "/assets/icon.png"));
  tray.on("click", trayOnClick);
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length !== 0) {
    showWindow();
  }
});
