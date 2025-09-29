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
        <option value="supinoRetoBanco">Supino Reto no Banco</option>
        <option value="tricepsPoliaCorda">Tríceps na Polia com Corda</option>
        <option value="cadeiraFlexora">Cadeira Flexora</option>
        {/* <option value="levantamentoTerra">(Não implementado ainda) Levantamento Terra</option> */}
        {/* <option value="agachamentoBulgaro">(Não implementado ainda) Agachamento Búlgaro com Halteres</option> */}
        {/* <option value="agachamentoSumo">(Não implementado ainda) Agachamento Sumô com Halteres</option> */}
      </select>
    </div>
  );
}
