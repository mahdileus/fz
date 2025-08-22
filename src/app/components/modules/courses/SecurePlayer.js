"use client";

import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player";

const SecurePlayer = ({ src, watermark }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef(null); // برای ذخیره نمونه Shaka Player

  useEffect(() => {
    if (typeof window === "undefined") return;

    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Shaka Player is not supported in this browser.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    playerRef.current = new shaka.Player(video);

    // مدیریت خطا
    playerRef.current.addEventListener("error", (event) => {
      console.error("⚠️ Shaka Error:", event.detail);
    });

    // بارگذاری ویدیو
    playerRef.current.load(src).catch((err) => {
      console.error("Shaka load error:", err);
      alert("خطا در بارگذاری ویدیو!");
    });

    let animationFrame;
    let watermarkPos = { x: 50, y: 50 };

    // تابع رسم واترمارک
    const drawWatermark = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (watermark) {
          ctx.font = "20px Arial";
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.fillText(watermark, watermarkPos.x, watermarkPos.y);
        }
      }

      animationFrame = requestAnimationFrame(drawWatermark);
    };

    drawWatermark();

    // جابجایی تصادفی واترمارک هر 3 ثانیه
    const interval = setInterval(() => {
      watermarkPos = {
        x: Math.random() * (canvas.width - 100) + 20,
        y: Math.random() * (canvas.height - 30) + 20,
      };
    }, 3000);

    // مدیریت حالت تمام‌صفحه
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "9999";
        document.fullscreenElement.appendChild(canvas);
      } else {
        video.parentNode.appendChild(canvas);
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // برای Safari

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      if (playerRef.current) {
        playerRef.current.destroy().catch((err) => console.error("Shaka destroy error:", err));
      }
    };
  }, [src, watermark]);

  // به‌روزرسانی سرعت پخش
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div className="relative w-full max-w-full">
      <video
        ref={videoRef}
        className="w-full h-auto aspect-video rounded-lg overflow-hidden"
        controls
        onContextMenu={(e) => e.preventDefault()}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* کنترل سرعت */}
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