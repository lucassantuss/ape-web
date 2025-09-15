import React from 'react';
import './InfoBox.css';

export default function InfoBox({ counter, angle }) {
  return (
    <div id="info" className='info-box'>
      <div>Repetições: <span>{counter}/10</span></div>
      <div>Ângulo: <span>{angle.toFixed(2)}</span></div>
    </div>
  );
}
