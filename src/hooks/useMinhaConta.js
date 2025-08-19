import { useState, useEffect } from "react";
import api from "../services/api";
import { formatCPF, validateCPF } from "utils/Validations";
import useAuthentication from "hooks/useAuthentication";

export default function useMinhaConta() {
  const [editando, setEditando] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [dadosEditados, setDadosEditados] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { signOut } = useAuthentication();

  const idUser = localStorage.getItem("@IdUser_APE");
  const tipoUsuario = localStorage.getItem("@UserType_APE");

  const endpointBase = tipoUsuario === "personal" ? "/Personal" : "/Aluno";

  // Buscar dados do usuário
  useEffect(() => {
    async function fetchUsuario() {
      if (!idUser) {
        setLoading(false);
        setError(new Error("Usuário não autenticado"));
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`${endpointBase}/PesquisarPorId/${idUser}`);

        if (response.data) {
          const usuario = response.data;
          setDadosEditados({
            tipo: tipoUsuario,
            nome: usuario.nome || "",
            email: usuario.email || "",
            usuario: usuario.usuario || "",
            cpf: usuario.cpf || "",
            personal: {
              id: usuario.idPersonal || "",
              nomeCompleto: usuario.nomePersonal || "",
            },
            cref: usuario.cref || "",
            estado: usuario.estado || "",
            cidade: usuario.cidade || "",
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
  }, [idUser, tipoUsuario, endpointBase]);

  // Atualizar os campos conforme o usuário digita
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

  // Salvar alterações
  const handleSalvar = async () => {
    let newErrors = {};

    if (!dadosEditados) return;

    if (!validateCPF(dadosEditados.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      await api.put(`${endpointBase}/${idUser}`, {
        nome: dadosEditados.nome,
        email: dadosEditados.email,
        usuario: dadosEditados.usuario,
        cpf: dadosEditados.cpf,
        idPersonal: dadosEditados.personal?.id || null,
        cref: dadosEditados.cref,
        estado: dadosEditados.estado,
        cidade: dadosEditados.cidade,
      });

      alert("Dados atualizados com sucesso!");
      setEditando(false);
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      alert("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Excluir conta
  const handleExcluirConta = async () => {
    try {
      setShowModalExcluir(false);

      if (!idUser) {
        throw new Error("Usuário não autenticado");
      }

      await api.delete(`${endpointBase}/${idUser}`);

      signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      alert("Não foi possível excluir a conta. Tente novamente.");
    }
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
