import { useState, useEffect } from "react";
import api from "services/api";

const mockHistorico = [
  {
    exercicio: "Rosca Direta",
    dataHora: "2025-08-20T10:30:00",
    repeticoes: 12,
    observacaoPersonal: "Execução ótima, mantenha o ritmo."
  },
  {
    exercicio: "Meio Agachamento",
    dataHora: "2025-08-18T09:00:00",
    repeticoes: 15,
    observacaoPersonal: "Cuidado com a postura, joelhos alinhados."
  },
  {
    exercicio: "Prancha",
    dataHora: "2025-08-16T08:00:00",
    repeticoes: 1,
    observacaoPersonal: "Segurar 60 segundos com abdômen contraído."
  }
];

export default function useHistoricoExercicio() {
  const [historico, setHistorico] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [observacaoSelecionada, setObservacaoSelecionada] = useState("");

  useEffect(() => {
    // Carregar dados chumbados
    setHistorico(mockHistorico);
  }, []);

//   useEffect(() => {
//     // Buscar histórico do aluno logado
//     async function fetchHistorico() {
//       const response = await api.get("/aluno/");
//       setHistorico(response.data);
//     }
//     fetchHistorico();
//   }, []);

  const abrirModal = (observacao) => {
    setObservacaoSelecionada(observacao);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setObservacaoSelecionada("");
  };

  return { historico, modalAberto, observacaoSelecionada, abrirModal, fecharModal };
}
