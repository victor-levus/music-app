import React from "react";
import { getAlbumArt } from "./GetAlbumArt";

const SongCard = ({ song }) => {
  return (
    <div className="w-[100%] h-16 bg-stone-950 shadow-xl flex items-center px-1">
      <img
        src={
          !song.tags?.picture?.data
            ? "https://streamdata.radiohitwave.com/api/placeholder-cover.jpg"
            : getAlbumArt(song)
        }
        alt=""
        width={"50px"}
      />

      <div className="text-left ms-2">
        <h4 className="text-base ">
          {!song.tags?.title
            ? song?.name?.slice(0, 25) || song?.file?.name?.slice(0, 25)
            : song.tags?.title?.slice(0, 25)}
        </h4>
        <h6 className="text-neutral-400 ">{song.tags?.artist?.slice(0, 25)}</h6>
      </div>

      <div className="flex-1 text-right song-time ">
        {/* <span> 05:12</span> */}
      </div>
    </div>
  );
};

export default SongCard;
