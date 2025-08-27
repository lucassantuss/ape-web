import React from 'react';
import './InfoBox.css';

export default function InfoBox({ counter, stage, angle, fonteGrande }) {
  return (
    <div id="info" className={`info-box ${fonteGrande ? 'grande' : 'pequeno'}`}>
      <div>Repetições: <span>{counter}</span></div>
      <div>Estágio: <span>{stage}</span></div>
      <div>Ângulo: <span>{angle.toFixed(2)}</span></div>
    </div>
  );
}
