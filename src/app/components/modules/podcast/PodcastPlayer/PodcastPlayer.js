"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { CiPlay1, CiPause1 } from "react-icons/ci";
import { IoVolumeHighOutline } from "react-icons/io5";
import { BsVolumeMute } from "react-icons/bs";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { useRef } from "react";

export default function PodcastPlayer({ src }) {
  const playerRef = useRef(null);

  const handleJumpForward = () => {
    if (playerRef.current) {
      playerRef.current.audio.current.currentTime += 10;
    }
  };

  const handleJumpBackward = () => {
    if (playerRef.current) {
      playerRef.current.audio.current.currentTime -= 10;
    }
  };

  return (
    <div dir="ltr" className="max-w-xl mx-auto">
      <AudioPlayer
        ref={playerRef}
        src={src}
        showSkipControls={false}
        showJumpControls={false}
        layout="horizontal-reverse"
        customIcons={{
          play: <CiPlay1 size={26} />,
          pause: <CiPause1 size={26} />,
          volume: <IoVolumeHighOutline size={20} />,
          volumeMute: <BsVolumeMute size={20} />,
        }}
        customAdditionalControls={[
          <button
            key="backward"
            onClick={handleJumpBackward}
            className="text-secondery hover:text-primary transition-all duration-200"
            title="برگشت 15 ثانیه‌ای"
          >
            <MdReplay10 size={24} />
          </button>,
        ]}
        customVolumeControls={[
          <button
            key="forward"
            onClick={handleJumpForward}
            className="text-secondery hover:text-primary transition-all duration-200"
            title="جلو رفتن 15 ثانیه‌ای"
          >
            <MdForward10 size={24} />
          </button>,
        ]}
        className={`
          !bg-white 
          !shadow-lg 
          !rounded-2xl 
          !px-6 !py-3 
          !text-primary 
          !border !border-gray-100
        `}
        progressBarClassName="!bg-gray-200 !rounded-full h-2"
        progressFilledClassName="!bg-secondery !rounded-full"
        timeClassName="!text-xs !text-gray-500"
      />
    </div>
  );
}
