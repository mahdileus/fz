"use client";

import { useEffect, useRef, useState } from "react";

const SecurePlayer = ({ src, watermark, img }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const videoEl = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let watermarkPos = { x: 50, y: 50 };

    const updateCanvasSize = () => {
      if (videoEl) {
        canvas.width = videoEl.clientWidth;
        canvas.height = videoEl.clientHeight;
      }
    };

    const drawWatermark = () => {
      if (ctx && canvas.width && canvas.height) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (watermark) {
          ctx.font = "20px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.fillText(watermark, watermarkPos.x, watermarkPos.y);
        }
      }
      animationFrame = requestAnimationFrame(drawWatermark);
    };

    const moveWatermark = () => {
      watermarkPos = {
        x: Math.random() * (canvas.width - 100) + 20,
        y: Math.random() * (canvas.height - 30) + 20,
      };
      drawWatermark();
    };

    if (videoEl) {
      // تنظیمات امنیت
      videoEl.addEventListener("contextmenu", (e) => e.preventDefault());
      videoEl.setAttribute("controlsList", "nodownload noremoteplayback");
      videoEl.setAttribute("disablePictureInPicture", "true");

      // تنظیم اندازه و رندر اولیه
      updateCanvasSize();
      drawWatermark();
      const interval = setInterval(moveWatermark, 3000);

      // به‌روزرسانی اندازه موقع تغییر اندازه پنجره
      const handleResize = () => updateCanvasSize();
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(interval);
        window.removeEventListener("resize", handleResize);
        videoEl.removeEventListener("contextmenu", (e) => e.preventDefault());
      };
    }
  }, [src, watermark, img]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div className="relative mx-auto w-full max-w-4xl aspect-video">
      <video
        ref={videoRef}
        src={src}
        poster={img}
        className="w-full h-full object-contain bg-black rounded-lg"
        playsInline
        controls
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      />
      <div className="absolute top-2 left-2 z-20 bg-black/50 px-2 py-1 rounded text-white">
        <label className="text-xs mr-2">سرعت:</label>
        <select
          value={playbackRate}
          onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          className="bg-black/30 text-white text-xs p-1 rounded"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  );
};

export default SecurePlayer;