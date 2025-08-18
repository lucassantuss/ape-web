import { useState, useEffect } from "react";
import api from "../services/api";
import { formatCPF, validateCPF } from "utils/Validations";

export default function useMinhaConta() {
  const [editando, setEditando] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [dadosEditados, setDadosEditados] = useState(null); // começa null até carregar
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const idUser = localStorage.getItem("@IdUser_APE");

  useEffect(() => {
    async function fetchUsuario() {
      if (!idUser) {
        setLoading(false);
        setError(new Error("Usuário não autenticado"));
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/Aluno/PesquisarPorId/${idUser}`);

        if (response.data) {
          const aluno = response.data;
          setDadosEditados({
            tipo: "aluno",
            nome: aluno.nome || "",
            email: aluno.email || "",
            usuario: aluno.usuario || "",
            cpf: aluno.cpf || "",
            personal: {
              id: aluno.idPersonal || "",
              nomeCompleto: "Carlos", // buscar nome do personal se quiser
            },
            cref: "",
            estado: "",
            cidade: "",
          });
        }
        setError(null);
      } catch (err) {
        setError(err);
        setDadosEditados(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuario();
  }, [idUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cpf") {
      newValue = formatCPF(newValue);
    }

    if (name.includes(".")) {
      const keys = name.split(".");
      setDadosEditados((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: newValue,
        },
      }));
    } else {
      setDadosEditados((prev) => ({ ...prev, [name]: newValue }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSalvar = () => {
    let newErrors = {};

    if (!dadosEditados) return;

    if (!validateCPF(dadosEditados.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // chamada API para salvar dados, ex:
    // await api.put(`/Aluno/Atualizar/${idUser}`, dadosEditados)

    console.log("Dados salvos:", dadosEditados);
    setEditando(false);
  };

  const handleExcluirConta = () => {
    setShowModalExcluir(false);
    // Chamar API para excluir conta, ex:
    // await api.delete(`/Aluno/Excluir/${idUser}`)

    console.log("Conta excluída!");
  };

  return {
    editando,
    setEditando,
    showModalExcluir,
    setShowModalExcluir,
    dadosEditados,
    errors,
    handleChange,
    handleSalvar,
    handleExcluirConta,
    loading,
    error,
  };
}
