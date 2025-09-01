import Button from "components/Button";
import Modal from 'components/Modal';
import TextArea from "components/TextArea";
import Title from "components/Title";
import useHistoricoExercicio from "pages/HistoricoExercicio/hooks/useHistoricoExercicio";

import "./HistoricoExercicio.css";

export default function HistoricoExercicio() {
  const {
    historico,
    observacaoSelecionada,
    modalAberto,
    setModalAberto,
    setObservacaoSelecionada,
    abrirModal,
    fecharModal,
    salvarObservacao,
  } = useHistoricoExercicio();

  return (
    <div className="relatorio-container">
      <Title
        titulo="Histórico de Exercícios"
      />

      {historico.length > 0 ? (
        <>
          <Title
            titulo2="Veja todos os treinos que você realizou"
          />
          <div className="relatorio-lista">
            {historico.map((item, index) => (
              <div key={index} className="relatorio-card">
                <h3>{item.nome}</h3>
                <p><strong>Data:</strong> {new Date(item.dataExecucao).toLocaleString()}</p>
                <p><strong>Repetições:</strong> {item.quantidadeRepeticoes}</p>
                <p><strong>% Acerto:</strong> {item.porcentagemAcertos ?? "-"}</p>
                <p><strong>Tempo Executado:</strong> {item.tempoExecutado || "-"}</p>
                <p><strong>Observações do Personal:</strong> {item.observacoesPersonal || "Nenhuma"}</p>
                <p><strong>Sua Observação:</strong> {item.observacoesAluno || "Nenhuma"}</p>
                <br />
                <Button
                  label="Adicionar Observação"
                  className="botao-observacao"
                  onClick={() => abrirModal(item.id)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <Title titulo2={"Nenhum exercício registrado até o momento."} />
      )}

      {modalAberto && (
        <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
          <h4>Adicionar Observação</h4>
          <TextArea
            value={observacaoSelecionada}
            onChange={(e) => setObservacaoSelecionada(e.target.value)}
            placeholder="Escreva sua observação..."
            rows={5}
          />
          <div className="modal-botoes">
            <Button label="Cancelar" onClick={fecharModal} cancel />
            <Button label="Salvar" onClick={salvarObservacao} />
          </div>
        </Modal>
      )}
    </div>
  );
}
