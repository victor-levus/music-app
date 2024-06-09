import React, { useEffect, useRef, useState } from "react";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import {
  IoFolderOpen,
  IoList,
  IoPause,
  IoPlay,
  IoShuffle,
} from "react-icons/io5";
import { getAlbumArt } from "./GetAlbumArt";
import moment from "moment";
import { PiRepeat, PiRepeatBold, PiRepeatOnceBold } from "react-icons/pi";
import _ from "lodash";
import SongCard from "./SongCard";

const jsmediatags = window.jsmediatags;

const MusicApp = () => {
  const audioPlayer = useRef();
  const seekRange = useRef();
  const shuffleBtn = useRef()?.current;
  const prevBtn = useRef()?.current;
  const playBtn = useRef()?.current;
  const pauseBtn = useRef()?.current;
  const nextBtn = useRef()?.current;
  const repeatBtn = useRef();

  const [songData, setSongData] = useState([]);
  const [songs, setSongs] = useState();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songPlaying, setSongPlaying] = useState("");
  const [playMode, setPlayMode] = useState("stop");
  const [seekValue, setSeekValue] = useState(0);
  const [repeatMode, setRepeatMode] = useState("repeatOff");
  const [showPlayer, setShowPlayer] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const folderPath2 = "C:/Users/HP/Music";
  const songTime = moment.duration(audioPlayer?.current?.duration, "seconds");

  useEffect(() => {
    getMetaData(folderPath2);
  }, []);

  const openFolderDialog = async () => {
    try {
      const result = await window.electron.selectMusicFolder();

      if (result) {
        getMetaData(result);
      }
    } catch (error) {}
  };

  const loadSongs = async (songData) => {
    try {
      setSongs(songData);
      setCurrentSongIndex(0);
      setPlayMode("stop");
      audioPlayer?.current?.pause();
      audioPlayer.current.currentTime = 0;
      setSeekValue(0);
      setSongPlaying("");
      setIsShuffled(false);
    } catch (error) {
      console.error("Error loading songs:", error);
      return;
    }
  };

  const getMetaData = async (folderPath) => {
    try {
      let data = [];
      const songsFile = await window.electron.readDirectory(folderPath);

      songsFile?.map(async (file, i) => {
        const blobFile = await fetch(file.path)
          .then((res) => res.blob())
          .then((blob) => {
            return blob;
          });

        const newFile = new File([blobFile], file.name, {
          type: blobFile.type,
          path: file.path,
        });
        jsmediatags.read(newFile, {
          onSuccess: (tag) => {
            data.push({ tags: tag.tags, file: file });
            setSongData([...data]);
            loadSongs([...data]);
          },
          onError: (error) => {
            data.push(file);
            setSongData([...data]);
            loadSongs([...data]);
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const playSong = (i) => {
    try {
      if (songs?.length > 0) {
        audioPlayer.current.src =
          songs[i != null ? i : currentSongIndex]?.file?.path ||
          songs[i != null ? i : currentSongIndex]?.path;
        audioPlayer.current.load();
        audioPlayer.current.play();
        setSongPlaying(songs[i != null ? i : currentSongIndex]);
        sendPlayNotification(
          "Now Playing..",
          songs[i != null ? i : currentSongIndex]
        );
        setPlayMode("playing");
      }

      // sendPlayNotification("Load Songs", "No Songs in the List");
    } catch (error) {
      setPlayMode("stop");
      console.log(error);
    }
  };

  const playSong2 = (newSongs) => {
    try {
      if (newSongs?.length > 0) {
        audioPlayer.current.src = newSongs[0]?.file?.path || newSongs[0]?.path;
        audioPlayer.current.load();
        audioPlayer.current.play();
        setSongPlaying(newSongs[0]);
        sendPlayNotification("Now Playing..", newSongs[0]);
        setPlayMode("playing");
      }

      // sendPlayNotification("Load Songs", "No Songs in the List");
    } catch (error) {
      setPlayMode("stop");
      console.log("couldnt play");
    }
  };

  const playPauseFunc = (song) => {
    if (playMode === "stop" && audioPlayer.current.paused) {
      playSong();
    } else if (playMode === "pause" && audioPlayer.current.paused) {
      audioPlayer.current.play();
      setPlayMode("playing");
    } else if (playMode === "playing") {
      audioPlayer.current.pause();
      setPlayMode("pause");
    }
  };

  const prevFunc = () => {
    setCurrentSongIndex((currentSongIndex - 1 + songs.length) % songs.length);
    playSong((currentSongIndex - 1 + songs.length) % songs.length);
  };

  const nextFunc = () => {
    if (repeatMode === "repeatOff") {
      if (currentSongIndex + 1 === songs?.length) {
        setPlayMode("stop");
        setCurrentSongIndex(0);
        setSeekValue(0);
        setSongPlaying("");
        return;
      } else {
        setCurrentSongIndex(currentSongIndex + 1);
        playSong(currentSongIndex + 1);
      }
    } else {
      setCurrentSongIndex((currentSongIndex + 1) % songs?.length);
      playSong((currentSongIndex + 1) % songs?.length);
    }
  };

  const sendPlayNotification = (title, songName) => {
    // window.electron.notificationApi.sendNotification(title, songName);
  };

  function handleOpenPlayer(params) {
    setShowPlayer(true);
  }

  function handleSeekChange(e) {
    setSeekValue(e.target.value);
    audioPlayer.current.currentTime = e.target.value;
  }

  function timeCount() {
    return setInterval(() => {
      setSeekValue(audioPlayer?.current?.currentTime);
    }, 1000);
  }

  function handleSelectRepeat() {
    if (repeatMode === "repeatOff") {
      setRepeatMode("repeatAll");
    } else if (repeatMode === "repeatAll") {
      setRepeatMode("repeatOne");
    } else {
      setRepeatMode("repeatOff");
    }
  }

  function handleShuffle() {
    if (!isShuffled) {
      const result = _.shuffle(songData);
      setCurrentSongIndex(0);
      setSongs(result);
      setIsShuffled(true);
      playSong2(result);
      return;
    }
    setIsShuffled(false);
  }

  // console.log(songs);
  // console.log(selectedFiles);
  // console.log(player);
  // console.log(seekRange?.current);

  // setInterval(() => {
  //   console.log("pill");
  // }, 1000);
  // console.log(songCurrentTime);
  // console.log(songPlaying);

  // console.log(seekRange.current?.value);

  return (
    <div className="p-3 h-screen relative overflow-hidden">
      <div className="music-dashboard overflow-hidden">
        <header className="flex justify-between gap-2 mb-3">
          <button className="cursor-pointer btn--hover" onClick={getMetaData}>
            <IoList className="text-2xl" />{" "}
          </button>
          <button
            className="cursor-pointer btn--hover"
            onClick={openFolderDialog}
          >
            <IoFolderOpen className="text-2xl " />{" "}
          </button>
        </header>

        <section className="h-[77vh] overflow-hidden mb-3">
          <div className="flex justify-between mb-1">
            <h2 className="text-3xl text-left ">Library</h2>
            <button
              onClick={() => {
                handleShuffle();
                setIsShuffled(false);
              }}
              className="app--button"
            >
              Shuffle List
            </button>
          </div>

          <div className="flex h-[76vh] pb-10 flex-col gap-1 overflow-y-scroll music-list">
            {songs === null || songs === undefined ? (
              <p>Loading...</p>
            ) : songs?.length === 0 ? (
              <>
                <p className="text-left my-3">
                  No music file in the selected folder
                </p>
                <div
                  onClick={openFolderDialog}
                  className="app--button cursor-pointer"
                >
                  Load Music
                </div>
              </>
            ) : (
              songs?.map((song, i) => (
                <div
                  key={i}
                  className="cursor-pointer relative"
                  onDoubleClick={() => {
                    setCurrentSongIndex(i);
                    setSongPlaying(song);
                    playSong(i);
                  }}
                >
                  {/* <SongCardSimple song={song?.file?.name} /> */}
                  {songPlaying === song && playMode === "playing" && (
                    <div className="bar--animation absolute right-1 bottom-4 z-10">
                      <div className="playing">
                        <span className="playing__bar playing__bar1"></span>
                        <span className="playing__bar playing__bar2"></span>
                        <span className="playing__bar playing__bar3"></span>
                      </div>
                    </div>
                  )}
                  <SongCard song={song} />
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="absolute bottom-3 w-[93vw] py-1 rounded-lg bg-[#3b0505b4] ">
          <div className="flex gap-6 px-2 items-center">
            {/* <img
              src={
                "https://streamdata.radiohitwave.com/api/placeholder-cover.jpg"
              }
              alt=""
              width={"50px"}
              className="cursor-pointer"
              onClick={handleOpenPlayer}
            /> */}

            {
              <div
                className="bar--animation cursor-pointer"
                onClick={handleOpenPlayer}
              >
                {playMode === "playing" && (
                  <div className="playing">
                    <span className="playing__bar playing__bar1 "></span>
                    <span className="playing__bar playing__bar2"></span>
                    <span className="playing__bar playing__bar3"></span>
                  </div>
                )}
              </div>
            }

            {/* Music Control btns */}
            <div className="flex justify-center gap-2 items-center text-2xl music-control-btns">
              <button className="btn--hover" ref={prevBtn} onClick={prevFunc}>
                <IoMdSkipBackward />
              </button>

              {playMode === "stop" || playMode === "pause" ? (
                <button
                  ref={playBtn}
                  className="flex justify-center items-center w-12 h-12 rounded-full bg-white text-black  play-control"
                  onClick={playPauseFunc}
                >
                  <IoPlay className="ms-1" />
                </button>
              ) : (
                <button
                  ref={pauseBtn}
                  className="flex justify-center items-center w-12 h-12 rounded-full bg-white text-black  play-control"
                  onClick={playPauseFunc}
                >
                  <IoPause className="" />
                </button>
              )}

              <button
                disabled={
                  currentSongIndex + 1 === songs?.length &&
                  repeatMode === "repeatOff"
                }
                className="btn--hover"
                ref={nextBtn}
                onClick={nextFunc}
              >
                <IoMdSkipForward />
              </button>
            </div>

            {playMode === "playing" && (
              <div className="song--time me-3 text-slate-300">
                <span>
                  {
                    moment.duration(
                      audioPlayer?.current?.currentTime,
                      "seconds"
                    )._data.minutes
                  }
                </span>
                <span>:</span>
                <span>
                  {
                    moment.duration(
                      audioPlayer?.current?.currentTime,
                      "seconds"
                    )._data.seconds
                  }
                </span>
                <span>/</span>
                <span>
                  {`${songTime._data.minutes}:${songTime._data.seconds}`}
                </span>
              </div>
            )}
          </div>
        </footer>
      </div>

      {/* Music Player */}
      <div
        className={`music--player ${
          showPlayer ? "" : "hidden"
        } absolute top-0 right-0 left-0 h-[100%] z-10 p-3 app-bg overflow-hidden`}
      >
        <div className="flex flex-col justify-around h-screen overflow-hidden">
          {/* Album art */}
          <div className="flex flex-col justify-center album-art">
            <img
              src={
                !songPlaying?.tags?.picture?.data
                  ? "https://streamdata.radiohitwave.com/api/placeholder-cover.jpg"
                  : getAlbumArt(songPlaying)
              }
              alt=""
              width={"100%"}
              className="rounded-lg mb-2"
            />

            {/* Current Song Playing title */}
            <div className="text-left">
              <h4 className="text-3xl song--name h-20 w-[300px]">
                {/* {songPlaying?.tags?.title?.slice(0, 25) + " ..."} */}
                {!songPlaying.tags?.title
                  ? songPlaying?.name?.slice(0, 25) ||
                    songPlaying?.file?.name?.slice(0, 25)
                  : songPlaying.tags?.title?.slice(0, 25)}
              </h4>
              <h6 className="text-neutral-400 song--artist h-10">
                {songPlaying?.tags?.artist}{" "}
              </h6>
            </div>
          </div>

          {/* Song slider */}
          <div className="song-slider">
            <input
              ref={seekRange}
              id="seek-range"
              className="w-full "
              type="range"
              // step={1}
              min={0}
              max={
                moment.duration(audioPlayer?.current?.duration, "seconds")._data
                  .minutes *
                  60 +
                moment.duration(audioPlayer?.current?.duration, "seconds")._data
                  .seconds
              }
              value={
                moment.duration(seekValue, "seconds")._data.minutes * 60 +
                moment.duration(seekValue, "seconds")._data.seconds
              }
              onChange={handleSeekChange}
            />

            <div className="flex justify-between text-xs text-slate-400 h-5">
              <p>
                {playMode !== "stop" &&
                  moment.duration(audioPlayer?.current?.currentTime, "seconds")
                    ._data.minutes +
                    ":" +
                    moment.duration(
                      audioPlayer?.current?.currentTime,
                      "seconds"
                    )._data.seconds}
              </p>
              <p>
                {playMode !== "stop" &&
                  `${songTime._data.minutes}:${songTime._data.seconds}`}
              </p>
            </div>
          </div>

          <audio
            onPlaying={timeCount}
            ref={audioPlayer}
            loop={repeatMode === "repeatOne" ? true : false}
            id="audio--player"
            src=""
            onCut={() => console.log("onCut")}
            onChange={() => console.log("onChange")}
            onRateChange={() => console.log("onRateChange")}
            onEnded={() => {
              nextFunc();
              clearInterval(timeCount);
            }}
          ></audio>

          {/* Music Control btns */}
          <div className="flex justify-between items-center text-3xl music-control-btns">
            <button
              className={`btn--hover ${isShuffled ? "shuffled" : ""}`}
              ref={shuffleBtn}
              onClick={handleShuffle}
            >
              <IoShuffle />
            </button>
            <button className="btn--hover" ref={prevBtn} onClick={prevFunc}>
              <IoMdSkipBackward />
            </button>

            {playMode === "stop" || playMode === "pause" ? (
              <button
                ref={playBtn}
                className="flex justify-center items-center w-16 h-16 rounded-full bg-white text-black  play-control"
                onClick={playPauseFunc}
              >
                <IoPlay className="ms-1" />
              </button>
            ) : (
              <button
                ref={pauseBtn}
                className="flex justify-center items-center w-16 h-16 rounded-full bg-white text-black  play-control"
                onClick={playPauseFunc}
              >
                <IoPause className="" />
              </button>
            )}

            <button
              disabled={
                currentSongIndex + 1 === songs?.length &&
                repeatMode === "repeatOff"
              }
              className="btn--hover"
              ref={nextBtn}
              onClick={nextFunc}
            >
              <IoMdSkipForward />
            </button>
            <button
              className={`btn--hover ${
                repeatMode === "repeatOne"
                  ? "repeatOne"
                  : repeatMode === "repeatAll"
                  ? "repeatAll"
                  : ""
              }`}
              ref={repeatBtn}
              onClick={handleSelectRepeat}
            >
              {repeatMode === "repeatOne" ? (
                <PiRepeatOnceBold />
              ) : repeatMode === "repeatAll" ? (
                <PiRepeatBold />
              ) : (
                <PiRepeat />
              )}
            </button>
          </div>

          {/* Music functions */}

          <div className="music-functions">
            <div className="flex justify-between">
              <button
                className="cursor-pointer btn--hover"
                onClick={() => setShowPlayer(false)}
              >
                <IoList className="text-2xl" />{" "}
              </button>
              <button
                className="cursor-pointer btn--hover"
                onClick={openFolderDialog}
              >
                <IoFolderOpen className="text-2xl " />{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicApp;
