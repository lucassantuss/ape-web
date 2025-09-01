import Button from "components/Button";
import TextArea from "components/TextArea";
import Title from "components/Title";
import useHistoricoExercicio from "pages/HistoricoExercicio/hooks/useHistoricoExercicio";

import "./HistoricoExercicio.css";

export default function HistoricoExercicio() {
  const {
    historico,
    modalAberto,
    observacaoSelecionada,
    abrirModal,
    fecharModal
  } = useHistoricoExercicio();

  return (
    <div className="relatorio-container">
      <Title
        titulo="Histórico de Exercícios"
        titulo2="Veja todos os treinos que você realizou"
      />

      {historico.length > 0 ? (
        <div className="relatorio-lista">
          {historico.map((item, index) => (
            <div key={index} className="relatorio-card">
              <h3>{item.exercicio}</h3>
              <p><strong>Data:</strong> {new Date(item.dataHora).toLocaleString()}</p>
              <p><strong>Repetições:</strong> {item.repeticoes}</p>
              <p><strong>Observações do Personal:</strong> {item.observacaoPersonal || 'Nenhuma'}</p>
              <br />
              <Button
                label="Ver Observação"
                className="botao-observacao"
                onClick={() => abrirModal(item.observacaoPersonal)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum exercício registrado até o momento.</p>
      )}

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Observação do Personal</h4>
            <TextArea
              value={observacaoSelecionada || ""}
              readOnly
              rows={5}
            />
            <div className="modal-botoes">
              <Button label="Fechar" onClick={fecharModal} cancel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
