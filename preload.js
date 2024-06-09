const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  selectMusicFolder: () => ipcRenderer.invoke("select-music-folder"),

  // directoryApi: {
  //   sendSelectMusicFolder() {
  //     console.log("preload here");
  //     ipcRenderer.send("select-music-folder");
  //   },
  // },

  readDirectory: (folderPath) =>
    ipcRenderer.invoke("read-directory", folderPath),

  notificationApi: {
    sendNotification(title, message) {
      ipcRenderer.send("notify", title, message);
    },
  },

  playSong: {
    sendPlaySong(song) {
      ipcRenderer.send("play", song);
    },
  },
});
