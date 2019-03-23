const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

function registerShortcuts(window, shortcuts, callback) {
  window.on('focus', () => {
    shortcuts.forEach((shortcut) => {
      globalShortcut.register(shortcut, callback);
    });
  });
  window.on('close', () => {
    unregisterShortcuts(shortcuts);
  });
  window.on('blur', () => {
    unregisterShortcuts(shortcuts);
  });
}

function unregisterShortcuts(shortcuts) {
  shortcuts.forEach((shortcut) => {
    globalShortcut.unregister(shortcut);
  });
}

function createWindow() {
  const window = new BrowserWindow({ width: 800, height: 550 });

  // load the dist folder from Angular
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  
  window.setMenuBarVisibility(false);
  window.setAutoHideMenuBar(true);

  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()

  registerShortcuts(window, ['CommandOrControl+W', 'CommandOrControl+Q'], () => {
    window.close();
  });

  registerShortcuts(window, ['CommandOrControl+N'], () => {
    createWindow();
  });

  const handleRedirect = (e, url) => {
    if (url != window.getURL()) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    }
  }
  window.webContents.on('will-navigate', handleRedirect);
  window.webContents.on('new-window', handleRedirect);
  return window;
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
  if (mainWindow === null) {
    mainWindow = createWindow();
    mainWindow.on('close', () => {
      mainWindow = null;
    });
  }
});