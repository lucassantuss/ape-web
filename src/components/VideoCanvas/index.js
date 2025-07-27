import React from 'react';
import './VideoCanvas.css';

export default function VideoCanvas({ canvasRef, videoRef }) {
  return (
    <>
      <video ref={videoRef} className="hidden-video" playsInline />
      <canvas ref={canvasRef} id="videoCanvas" className="video-canvas" />
    </>
  );
}
