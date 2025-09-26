import Button from "components/Button";
import Modal from 'components/Modal';
import TextArea from "components/TextArea";
import Title from "components/Title";
import useHistoricoExercicio from "pages/HistoricoExercicio/hooks/useHistoricoExercicio";

import { useNavigate } from "react-router-dom";

import "./HistoricoExercicio.css";
import ModalInfo from "components/ModalInfo";
import Loading from "components/Loading";

export default function HistoricoExercicio() {
  const navigate = useNavigate();

  const {
    autorizadoAcessoAluno,
    mensagemAcessoAluno,
    historico,
    observacaoSelecionada,
    modalAberto,
    setModalAberto,
    setObservacaoSelecionada,
    abrirModal,
    fecharModal,
    salvarObservacao,
    treinoSelecionadoParaRemocao,
    abrirModalRemocao,
    confirmarRemocao,
    modalRemocaoAberto,
    setModalRemocaoAberto,
    showModalInfo,
    modalInfoTitle,
    modalInfoMessage,
    fecharModalInfo,
  } = useHistoricoExercicio();

  if (autorizadoAcessoAluno === null) return <Loading />;
  if (autorizadoAcessoAluno === false) {
    return (
      <div className="container">
        <Title titulo="Não foi possível acessar o conteúdo dessa tela" titulo2={mensagemAcessoAluno} />
        <Button
          label="Voltar"
          onClick={() => navigate("/minha-conta")}
          variant="info"
        />
      </div>
    );
  }

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
                <p><strong>Data:</strong> {item.dataExecucao}</p>
                <p><strong>Repetições:</strong> {item.quantidadeRepeticoes}</p>
                <p><strong>Acerto:</strong> {item.porcentagemAcertos + "%" ?? "-"}</p>
                <p><strong>Tempo Executado:</strong> {item.tempoExecutado || "-"}</p>
                <p><strong>Observações do Personal:</strong> {item.observacoesPersonal || "Nenhuma"}</p>
                <p><strong>Sua Observação:</strong> {item.observacoesAluno || "Nenhuma"}</p>
                <br />
                <Button
                  label="Adicionar Observação"
                  className="botao-observacao"
                  onClick={() => abrirModal(item.id)}
                  variant="success"
                />
                <br />
                <Button
                  label="Excluir Treino"
                  className="botao-remover"
                  onClick={() => abrirModalRemocao(item)}
                  variant="cancel"
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
            <Button
              label="Cancelar"
              onClick={fecharModal}
              variant="cancel"
            />
            <Button
              label="Salvar"
              onClick={salvarObservacao}
              variant="success"
            />
          </div>
        </Modal>
      )}

      {modalRemocaoAberto && (
        <Modal isOpen={modalRemocaoAberto} onClose={() => setModalRemocaoAberto(false)}>
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja <strong>excluir</strong> o treino{" "}
            <strong>{treinoSelecionadoParaRemocao?.nome}</strong> da sua lista?
          </p>
          <div className="modal-botoes">
            <Button
              label="Cancelar"
              onClick={() => setModalRemocaoAberto(false)}
              variant="cancel"
            />
            <Button
              label="Confirmar Exclusão"
              onClick={confirmarRemocao}
              variant="success"
            />
          </div>
        </Modal>
      )}

      <ModalInfo
        isOpen={showModalInfo}
        onClose={fecharModalInfo}
        title={modalInfoTitle}
        message={modalInfoMessage}
      />
    </div>
  );
}
