import { useState, useEffect } from "react";
import api from "services/api";

export default function useHistoricoExercicio() {
  const [historico, setHistorico] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [observacaoSelecionada, setObservacaoSelecionada] = useState("");
  const [idExercicioSelecionado, setIdExercicioSelecionado] = useState(null);

  const idUser = localStorage.getItem("@IdUser_APE");

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const response = await api.get(`/Exercicio/listByIdUser/${idUser}`);
        setHistorico(response.data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
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
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
    }
  };

  return {
    historico,
    observacaoSelecionada,
    modalAberto,
    setModalAberto,
    setObservacaoSelecionada,
    abrirModal,
    fecharModal,
    salvarObservacao,
  };
}
