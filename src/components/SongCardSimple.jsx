import React from "react";
import { getAlbumArt } from "./GetAlbumArt";

const SongCardSimple = ({ song }) => {
  // console.log(song);
  return (
    <div className="w-[100%] h-16 bg-stone-800 shadow-xl flex items-center px-1 hover:bg-stone-900 relative">
      <img
        src={
          !song?.tags?.picture?.data
            ? "https://streamdata.radiohitwave.com/api/placeholder-cover.jpg"
            : getAlbumArt(song)
        }
        alt=""
        width={"50px"}
      />

      <div className="text-left ms-2">
        <h4 className="text-base w-[250px]">
          {!song ? "" : song.slice(0, 25) + " ..."}
        </h4>
        {/* <h6 className="text-neutral-400 "></h6> */}
      </div>

      <div className="flex-1 text-right song-time ">
        {/* <span> 05:12</span> */}
      </div>
    </div>
  );
};

export default SongCardSimple;
