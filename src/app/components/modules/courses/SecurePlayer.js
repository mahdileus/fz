"use client";

import { useEffect, useRef } from "react";
import shaka from "shaka-player";

const SecurePlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const video = videoRef.current;
    if (!video) return;

    const player = new shaka.Player(video);

    // Debug logs
    console.log("Trying to load:", src);

    player.load(src).catch(error => {
      console.error("Shaka load error:", error);
    });

    return () => {
      player.destroy();
    };
  }, [src]);

  return <video ref={videoRef} controls className="w-full h-auto" />;
};

export default SecurePlayer;
