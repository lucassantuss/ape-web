import api from "services/api";

export const verificarAceite = async () => {
  try {
    const idAluno = localStorage.getItem("@IdUser_APE");

    if (!idAluno) {
      return false;
    }

    const response = await api.get(`/aluno/personal/${idAluno}`);

    if (response.status === 200 && response.data?.resultado === true) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro ao verificar aceite do personal:", error);
    return false;
  }
};
