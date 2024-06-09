const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification,
} = require("electron");
const path = require("path");
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 360,
    height: 700,
    darkTheme: true,

    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: false,
      webSecurity: false,
    },
    resizable: false,
  });

  win.setMenuBarVisibility(false);
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("notify", (_, messageTitle, message) => {
  const notification = new Notification({
    title: messageTitle,
    subtitle: "Now Playing...",
    replyPlaceholder: "ffff",
    body: message,
  });

  notification.close();

  notification.show();
});

ipcMain.on("play", (_, song) => {});

ipcMain.handle("select-music-folder", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});

ipcMain.handle("read-directory", async (event, folderPath) => {
  let data = [];

  function* readAllFiles(dir) {
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });

      for (const file of files) {
        if (file.isDirectory()) {
          yield* readAllFiles(path.join(dir, file.name));
        } else {
          yield {
            path: path.join(file.path, file.name),
            name: file.name,
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  for (const file of readAllFiles(folderPath)) {
    data.push(file);
  }

  return data.filter((file) => file?.name?.endsWith(".mp3"));
});
