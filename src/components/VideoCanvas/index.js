import React, { useEffect } from 'react';
import './VideoCanvas.css';

export default function VideoCanvas({ canvasRef, videoRef }) {
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const updateCanvasSize = () => {
      const { videoWidth, videoHeight } = video;
      const isMobile = window.innerWidth <= 768;

      if (isMobile && videoWidth && videoHeight) {
        const aspectRatio = videoWidth / videoHeight;

        // Mantém largura 100% e altura proporcional
        canvas.style.width = '100%';
        canvas.style.height = `${100 / aspectRatio}vw`; // relativo à largura da tela
      }
    };

    video.addEventListener('loadedmetadata', updateCanvasSize);
    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasSize);
    };
  }, [videoRef, canvasRef]);

  return (
    <>
      <video ref={videoRef} className="hidden-video" playsInline />
      <canvas ref={canvasRef} id="videoCanvas" className="video-canvas" />
    </>
  );
}
