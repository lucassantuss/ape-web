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
        <option value="roscaDiretaHalteres">Rosca Direta com Halteres</option>
        <option value="supinoReto">Supino Reto no Banco</option>
        <option value="tricepsCorda">Tríceps Corda na Polia Alta</option>
        <option value="prancha">Prancha</option>
        <option value="cadeiraFlexora">Cadeira Flexora</option>
        <option value="levantamentoTerra">Levantamento Terra</option>
        <option value="agachamentoBulgaro">Agachamento Búlgaro com Halteres</option>
        <option value="agachamentoSumo">Agachamento Sumô com Halteres</option>
      </select>
    </div>
  );
}
