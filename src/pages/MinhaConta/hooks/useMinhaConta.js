import { useState, useEffect } from "react";
import useModalInfo from 'components/ModalInfo/hooks/useModalInfo';
import api from "../../../services/api";
import { formatCPF, validateCPF } from "utils/Validations";

export default function useMinhaConta() {
    const [editando, setEditando] = useState(false);
    const [showModalExcluir, setShowModalExcluir] = useState(false);
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [categoriaCref, setCategoriaCref] = useState([]);
    const [personais, setPersonais] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dadosOriginais, setDadosOriginais] = useState(null);
    const [dadosEditados, setDadosEditados] = useState(null);

    const [showModalPersonal, setShowModalPersonal] = useState(false);
    const [nomePersonal, setNomePersonal] = useState("");
    const [pesquisa, setPesquisa] = useState("");

    const {
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        exibirModalInfo,
        fecharModalInfo,
    } = useModalInfo();

    const [redirectOnClose, setRedirectOnClose] = useState(false);

    const idUser = localStorage.getItem("@IdUser_APE");
    const tipoUsuario = localStorage.getItem("@UserType_APE"); // "aluno" | "personal"

    // define base do endpoint conforme o tipo
    const endpointBase = tipoUsuario?.toLowerCase() === "personal" ? "/Personal" : "/Aluno";

    // Buscar estados via IBGE
    const fetchEstados = async () => {
        try {
            const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
            const data = await response.json();
            const lista = data
                .map((uf) => ({
                    value: uf.sigla,
                    label: uf.nome,
                    id: uf.id,
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
            setEstados(lista);
        } catch (err) {
            exibirModalInfo("Erro", "Erro ao buscar os estados");
        }
    };

    // Buscar cidades do estado selecionado
    const fetchCidades = async (estadoId) => {
        try {
            const response = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
            );
            const data = await response.json();
            const lista = data.map((cidade) => ({
                value: cidade.nome,
                label: cidade.nome,
            }));
            setCidades(lista);
        } catch (err) {
            exibirModalInfo("Erro", "Erro ao buscar as cidades");
        }
    };

    // Popula as categorias profissionais do CREF
    const fetchCategoriaCref = async () => {
        try {
            const categorias = [
                { value: "G", label: "G - Graduação em Educação Física" },
                { value: "P", label: "P - Provisório" },
                { value: "F", label: "F - Formação anterior à Lei 9696/98" },
            ];
            setCategoriaCref(categorias);
        } catch (err) {
            exibirModalInfo("Erro", "Erro ao buscar as categorias");
        }
    };

    // Buscar todos os personais
    const fetchPersonais = async () => {
        try {
            const response = await api.get("/Personal");
            // Garantir que cada personal tenha { id, nomeCompleto }
            const lista = response.data.map((p) => ({
                id: p.id,
                nomeCompleto: p.nome,
            }));
            setPersonais(lista);
        } catch (err) {
            exibirModalInfo("Erro", "Erro ao buscar os personais");
        }
    };

    useEffect(() => {
        fetchCategoriaCref();
        fetchEstados();
        fetchPersonais();
    }, []);

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
                let token = api.defaults.headers.authorization;
                const response = await api.get(`${endpointBase}/${idUser}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data) {
                    const usuario = response.data;

                    if (tipoUsuario === "personal" && usuario.estado) {
                        const estadoObj = estados.find(
                            (uf) => uf.value.toLowerCase() === usuario.estado.toLowerCase()
                        );

                        if (estadoObj) {
                            await fetchCidades(estadoObj.id).then(() => {
                                setDadosEditados((prev) => ({
                                    ...prev,
                                    cidade: usuario.cidade || "",
                                }));
                            });
                        }
                    }

                    // Para usuários do tipo ALUNO, buscar personal vinculado
                    let personalSelecionado = null;
                    if (tipoUsuario === "aluno" && usuario.idPersonal) {
                        try {
                            const respPersonal = await api.get(`/Personal/${usuario.idPersonal}`);
                            personalSelecionado = respPersonal.data;
                        } catch (err) {
                            exibirModalInfo("Erro", "Personal vinculado não encontrado");
                        }
                    }

                    const usuarioFormatado = {
                        tipo: tipoUsuario,
                        nome: usuario.nome || "",
                        email: usuario.email || "",
                        usuario: usuario.usuario || "",
                        cpf: usuario.cpf || "",
                        personal:
                            tipoUsuario === "aluno"
                                ? personalSelecionado
                                    ? { id: usuario.idPersonal, nomeCompleto: personalSelecionado.nome }
                                    : { id: "", nomeCompleto: "" }
                                : null,
                        estado: tipoUsuario === "personal" ? usuario.estado || "" : "",
                        cidade: tipoUsuario === "personal" ? usuario.cidade || "" : "",
                        numeroCref: tipoUsuario === "personal" ? usuario.numeroCref || "" : "",
                        categoriaCref: tipoUsuario === "personal" ? usuario.categoriaCref || "" : "",
                        siglaCref: tipoUsuario === "personal" ? usuario.siglaCref || "" : "",
                    };

                    setDadosOriginais(usuarioFormatado);
                    setDadosEditados(usuarioFormatado);
                }
                setError(null);
            } catch (err) {
                setError(err);
                setDadosEditados(null);
            } finally {
                setLoading(false);
            }
        }

        if (estados.length > 0) {
            fetchUsuario();
        }
    }, [idUser, tipoUsuario, endpointBase, estados]);

    // Atualizar os campos conforme o usuário digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "cpf") {
            newValue = formatCPF(newValue);
        }

        if (name === "estado") {
            const estadoObj = estados.find((uf) => uf.value === value);
            if (estadoObj) fetchCidades(estadoObj.id);

            setDadosEditados((prev) => ({
                ...prev,
                estado: value,
                cidade: "", // reseta cidade quando trocar estado
                siglaCref: value, // sigla do estado
            }));
        } else if (name.includes(".")) {
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

    const handleSelecionadoPersonal = (event) => {
        const personal = personais.find(p => p.id === event.target.value);
        setNomePersonal(personal?.nomeCompleto || "");
        setDadosEditados(prev => ({
            ...prev,
            personal: { id: personal?.id || "", nomeCompleto: personal?.nomeCompleto || "" }
        }));
        setShowModalPersonal(false);
        setPesquisa("");
    };

    const handlePesquisaPersonal = (event) => setPesquisa(event.target.value);

    const validarDados = (dados) => {
        let newErrors = {};

        if (!dados) return newErrors;

        // comuns
        if (!dados.nome) newErrors.nome = "Campo obrigatório";
        if (!dados.usuario) newErrors.usuario = "Campo obrigatório";

        const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
        if (!dados.email) {
            newErrors.email = "Campo obrigatório";
        } else if (!validateEmail(dados.email)) {
            newErrors.email = "Email inválido";
        }

        if (!dados.cpf || !validateCPF(dados.cpf)) {
            newErrors.cpf = "CPF inválido";
        }

        // aluno
        if (dados.tipo === "aluno") {
            if (!dados.personal?.id) {
                newErrors.personal = "Campo obrigatório";
            }
        }

        // personal
        if (dados.tipo === "personal") {
            if (!dados.numeroCref) newErrors.numeroCref = "Campo obrigatório";
            if (!dados.estado) newErrors.estado = "Campo obrigatório";
            if (!dados.cidade) newErrors.cidade = "Campo obrigatório";
            if (!dados.categoriaCref) newErrors.categoriaCref = "Campo obrigatório";
        }

        return newErrors;
    };

    // Salvar alterações
    const handleSalvar = async () => {
        if (!dadosEditados) return;

        const newErrors = validarDados(dadosEditados);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            // Campos comuns
            const payload = {
                usuario: dadosEditados.usuario,
                nome: dadosEditados.nome,
                email: dadosEditados.email,
                cpf: dadosEditados.cpf,
            };

            if (dadosEditados.tipo === "aluno") {
                payload.idPersonal = dadosEditados.personal?.id || null;
            }

            if (dadosEditados.tipo === "personal") {
                payload.estado = dadosEditados.estado;
                payload.cidade = dadosEditados.cidade;
                payload.numeroCref = dadosEditados.numeroCref;
                payload.categoriaCref = dadosEditados.categoriaCref;
                payload.siglaCref = dadosEditados.siglaCref;
            }

            await api.put(`${endpointBase}/${idUser}`, payload);

            exibirModalInfo("Sucesso", "Dados atualizados com sucesso!");
            setEditando(false);
        } catch (err) {
            exibirModalInfo("Erro", "Não foi possível salvar as alterações. Tente novamente.");
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

            exibirModalInfo("Sucesso", "Conta excluída com sucesso!");
            setRedirectOnClose(true);
        } catch (err) {
            exibirModalInfo("Erro", "Não foi possível excluir a conta. Tente novamente.");
        }
    };

    return {
        editando,
        setDadosEditados,
        setEditando,
        showModalExcluir,
        setShowModalExcluir,
        showModalPersonal,
        setShowModalPersonal,
        dadosOriginais,
        dadosEditados,
        errors,
        personais,
        nomePersonal,
        categoriaCref,
        pesquisa,
        redirectOnClose,
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        fecharModalInfo,
        handleChange,
        handleSalvar,
        handleExcluirConta,
        handleSelecionadoPersonal,
        handlePesquisaPersonal,
        loading,
        error,
        estados,
        cidades,
    };
}
