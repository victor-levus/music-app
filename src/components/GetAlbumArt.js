export const getAlbumArt = (song) => {
  const data = song.tags?.picture?.data;
  const format = song.tags?.picture?.format;
  let base64String = "";

  for (let i = 0; i < data?.length; i++) {
    base64String += String.fromCharCode(data[i]);
  }

  return `data:${format};base64,${window.btoa(base64String)}`;
};
