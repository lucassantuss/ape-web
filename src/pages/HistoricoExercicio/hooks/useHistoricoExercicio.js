import useModalInfo from "components/ModalInfo/hooks/useModalInfo";
import { useState, useEffect } from "react";
import api from "services/api";
import { verificarAceite } from "utils/VerificarAceite";

export default function useHistoricoExercicio() {

  const [historico, setHistorico] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [observacaoSelecionada, setObservacaoSelecionada] = useState("");
  const [idExercicioSelecionado, setIdExercicioSelecionado] = useState(null);

  const [modalRemocaoAberto, setModalRemocaoAberto] = useState(false);
  const [treinoSelecionadoParaRemocao, setTreinoSelecionadoParaRemocao] = useState(null);

  const {
    showModalInfo,
    modalInfoTitle,
    modalInfoMessage,
    exibirModalInfo,
    fecharModalInfo,
  } = useModalInfo();

  const [autorizadoAcessoAluno, setAutorizadoAcessoAluno] = useState(null);
  const [mensagemAcessoAluno, setMensagemAcessoAluno] = useState("");
  useEffect(() => {
    const checarAceite = async () => {
      const retorno = await verificarAceite();
      setAutorizadoAcessoAluno(retorno.Resultado);
      setMensagemAcessoAluno(retorno.Mensagem);
    };

    checarAceite();
  }, []);

  const idUser = localStorage.getItem("@IdUser_APE");

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const response = await api.get(`/Exercicio/listByIdUser/${idUser}`);
        setHistorico(response.data);
      } catch {
        exibirModalInfo("Erro", "Erro ao carregar histórico.");
      }
    }

    if (idUser) {
      fetchHistorico();
    }
  }, [idUser]);

  const abrirModal = (idExercicio) => {
    setIdExercicioSelecionado(idExercicio);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setObservacaoSelecionada("");
    setIdExercicioSelecionado(null);
  };

  const salvarObservacao = async () => {
    try {
      await api.put(`/Exercicio/adicionarObservacaoAluno/${idExercicioSelecionado}`,
        observacaoSelecionada,
        { headers: { "Content-Type": "application/json" } }
      );
      fecharModal();

      // Atualizar histórico após adicionar observação
      const response = await api.get(`/Exercicio/listByIdUser/${idUser}`);
      setHistorico(response.data);

      exibirModalInfo("Sucesso", "Observação adicionada com sucesso!");
    } catch {
      exibirModalInfo("Erro", "Não foi possível salvar a observação.");
    }
  };

  const abrirModalRemocao = (treino) => {
    setTreinoSelecionadoParaRemocao(treino);
    setModalRemocaoAberto(true);
  };

  const confirmarRemocao = async () => {
    if (!treinoSelecionadoParaRemocao) return;

    try {
      await api.delete(`/Exercicio/${treinoSelecionadoParaRemocao.id}`);
      setHistorico(historico.filter(t => t.id !== treinoSelecionadoParaRemocao.id));

      setModalRemocaoAberto(false);
      setTreinoSelecionadoParaRemocao(null);

      exibirModalInfo("Sucesso", "Treino excluído com sucesso!");
    } catch (error) {
      exibirModalInfo("Erro", "Não foi possível excluir o treino. Tente novamente.");
    }
  };

  return {
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
  };
}
