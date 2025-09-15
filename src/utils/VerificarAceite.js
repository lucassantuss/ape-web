import api from "services/api";

export const verificarAceite = async () => {
  try {
    const idAluno = localStorage.getItem("@IdUser_APE");

    if (!idAluno) {
      return {
        Resultado: false,
        Mensagem: "ID do aluno não encontrado."
      };
    }

    const response = await api.get(`/aluno/personal/${idAluno}`);

    if (response.status === 200 && response.data) {
      return {
        Resultado: response.data.resultado,
        Mensagem: response.data.mensagem || ""
      };
    }

    return {
      Resultado: false,
      Mensagem: "Não foi possível obter a análise do personal."
    };
  } catch (error) {
    console.error("Erro ao verificar aceite do personal:", error);
    return {
      Resultado: false,
      Mensagem: "Erro de conexão com o servidor."
    };
  }
};
