const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 550 });

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  
  win.setMenuBarVisibility(false);
  win.setAutoHideMenuBar(true);

  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });

  
  globalShortcut.register('CommandOrControl+W', () => {
    app.quit();
  });

  const handleRedirect = (e, url) => {
    if (url != win.getURL()) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    }
  }
  win.webContents.on('will-navigate', handleRedirect)
  win.webContents.on('new-window', handleRedirect)
}



app.on("ready", createWindow);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// initialize the app's main window
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});