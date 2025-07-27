import React from 'react';
import './SelectExercicio.css';

export default function SelectExercicio({ selectedExercise, onChange }) {
  return (
    <div id="grupoInferior" className="select-exercicio-container">
      <select
        id="comboExercicio"
        value={selectedExercise}
        onChange={(e) => onChange(e.target.value)}
        className="select-exercicio-select"
      >
        <option value="roscaDireta">Rosca Direta</option>
        <option value="meioAgachamento">Meio Agachamento</option>
        {/* <option value="cadeiraExtensora">Cadeira Extensora</option> */}
        {/* <option value="supinoReto">Supino Reto</option> */}
      </select>
    </div>
  );
}
