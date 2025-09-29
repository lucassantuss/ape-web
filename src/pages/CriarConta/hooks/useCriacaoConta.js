import { useState, useEffect } from "react";
import api from "services/api";

import { formatCPF, validateCPF } from 'utils/Validations';
import useModalInfo from "components/ModalInfo/hooks/useModalInfo";

export default function useCriacaoConta() {
    const [tipoUsuario, setTipoUsuario] = useState("aluno");
    const [errors, setErrors] = useState({});
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [categoriaCref, setCategoriaCref] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [nomePersonal, setNomePersonal] = useState("");
    const [personais, setPersonais] = useState([]);

    const {
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        exibirModalInfo,
        fecharModalInfo,
    } = useModalInfo();

    const [aceiteTermosAluno, setAceiteTermosAluno] = useState(false);
    const [aceiteTermosPersonal, setAceiteTermosPersonal] = useState(false);
    const [redirectOnClose, setRedirectOnClose] = useState(false);

    const [formDataAluno, setFormDataAluno] = useState({
        nome: "",
        usuario: "",
        email: "",
        cpf: "",
        senha: "",
        confSenha: "",
        idPersonal: "",
        aceiteTermos: false,
    });

    const [formDataPersonal, setFormDataPersonal] = useState({
        nome: "",
        usuario: "",
        senha: "",
        confSenha: "",
        email: "",
        cpf: "",
        estado: "",
        cidade: "",
        numeroCref: "",
        categoriaCref: "",
        siglaCref: "",
        aceiteTermos: false,
    });

    // Busca estados via API IBGE
    const fetchEstados = async () => {
        try {
            const response = await fetch(
                "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
            );
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

    // Busca cidades do estado selecionado
    const fetchCidades = async (estadoId) => {
        try {
            const response = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
            );
            const data = await response.json();
            const lista = data.map((cidade) => ({
                value: cidade.sigla,
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

    // Busca personais via API
    const fetchPersonais = async () => {
        try {
            const response = await api.get("Personal");
            const lista = response.data.map(p => ({
                id: p.id,
                nomeCompleto: p.nome
            }));
            setPersonais(lista);
        } catch (err) {
            exibirModalInfo("Erro", "Erro ao buscar os personais");
        }
    };

    useEffect(() => {
        fetchEstados();
        fetchCategoriaCref();
        fetchPersonais();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "cpf") {
            const novoValor = formatCPF(value);
            if (tipoUsuario === "aluno") {
                setFormDataAluno({ ...formDataAluno, [name]: novoValor });
            } else {
                setFormDataPersonal({ ...formDataPersonal, [name]: novoValor });
            }
        } else if (name === "estado") {
            const estadoObj = estados.find((uf) => uf.value === value);
            if (estadoObj) fetchCidades(estadoObj.id);
            setFormDataPersonal({ ...formDataPersonal, estado: value, cidade: "" });
        } else {
            if (tipoUsuario === "aluno") {
                setFormDataAluno({ ...formDataAluno, [name]: value });
            } else {
                setFormDataPersonal({ ...formDataPersonal, [name]: value });
            }
        }
        setErrors({ ...errors, [name]: "" });
    };

    const handlePesquisa = (event) => {
        setPesquisa(event.target.value);
    };

    const handleSelecionado = (event) => {
        const personal = personais.find(
            (p) => p.id === event.target.value
        );
        setNomePersonal(personal?.nomeCompleto || "");
        setFormDataAluno((prev) => ({ ...prev, idPersonal: personal?.id }));
        setShowModal(false);
        setPesquisa("");
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

        // Regex senha forte: mínimo 8 caracteres, 1 minúscula, 1 maiúscula, 1 número e 1 especial
        const validateSenhaForte = (senha) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha);

        const formData =
            tipoUsuario === "aluno" ? formDataAluno : formDataPersonal;

        if (!formData.nome) {
            newErrors.nome = "Campo obrigatório";
            isValid = false;
        }
        if (!formData.usuario) {
            newErrors.usuario = "Campo obrigatório";
            isValid = false;
        }
        if (!formData.email) {
            newErrors.email = "Campo obrigatório";
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Email inválido";
            isValid = false;
        }
        if (!formData.cpf || !validateCPF(formData.cpf)) {
            newErrors.cpf = "CPF inválido";
            isValid = false;
        }
        if (!formData.senha || formData.senha !== formData.confSenha) {
            newErrors.senha = "As senhas não conferem";
            newErrors.confSenha = "As senhas não conferem";
            isValid = false;
        } else if (!validateSenhaForte(formData.senha)) {
            newErrors.senha =
                "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial";
            isValid = false;
        }

        if (tipoUsuario === "aluno" && !aceiteTermosAluno) {
            newErrors.aceiteTermosAluno = "É necessário aceitar os termos para continuar";
            isValid = false;
        }

        if (tipoUsuario === "personal" && !aceiteTermosPersonal) {
            newErrors.aceiteTermosPersonal = "É necessário aceitar os termos para continuar";
            isValid = false;
        }

        if (tipoUsuario === "aluno" && !formData.idPersonal) {
            newErrors.personal = "Campo obrigatório";
            isValid = false;
        }
        if (
            tipoUsuario === "personal" &&
            (!formData.numeroCref || !formData.estado || !formData.cidade)
        ) {
            if (!formData.numeroCref) newErrors.numeroCref = "Campo obrigatório";
            if (!formData.estado) newErrors.estado = "Campo obrigatório";
            if (!formData.cidade) newErrors.cidade = "Campo obrigatório";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        let novoUsuarioDto;
        let response;
        try {
            if (tipoUsuario === "aluno") {
                novoUsuarioDto = {
                    Id: '',
                    Usuario: formDataAluno.usuario,
                    Nome: formDataAluno.nome,
                    Email: formDataAluno.email,
                    CPF: formDataAluno.cpf,
                    Senha: formDataAluno.senha,
                    IdPersonal: formDataAluno.idPersonal,
                    AceiteTermos: aceiteTermosAluno,
                };
                response = await api.post("Aluno", novoUsuarioDto);
            } else {
                novoUsuarioDto = {
                    Id: '',
                    Nome: formDataPersonal.nome,
                    Usuario: formDataPersonal.usuario,
                    Email: formDataPersonal.email,
                    Senha: formDataPersonal.senha,
                    CPF: formDataPersonal.cpf,
                    Estado: formDataPersonal.estado,
                    Cidade: formDataPersonal.cidade,
                    NumeroCref: formDataPersonal.numeroCref,
                    CategoriaCref: formDataPersonal.categoriaCref,
                    SiglaCref: formDataPersonal.estado,
                    AceiteTermos: aceiteTermosPersonal,
                };
                response = await api.post("Personal", novoUsuarioDto);
            }

            if (response.data.resultado) {
                exibirModalInfo("Sucesso", `Usuário ${tipoUsuario} criado com sucesso!`);
                setRedirectOnClose(true);

                // limpa os formulários
                setFormDataAluno({
                    nome: "",
                    usuario: "",
                    email: "",
                    cpf: "",
                    senha: "",
                    confSenha: "",
                    idPersonal: "",
                    aceiteTermos: false,
                });

                setFormDataPersonal({
                    nome: "",
                    usuario: "",
                    senha: "",
                    confSenha: "",
                    email: "",
                    cpf: "",
                    estado: "",
                    cidade: "",
                    numeroCref: "",
                    categoriaCref: "",
                    siglaCref: "",
                    aceiteTermos: false,
                });
            }
        } catch (error) {
            exibirModalInfo("Erro", error.response?.data?.mensagem || "Não foi possível criar a conta.");
        }
    };

    return {
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        exibirModalInfo,
        fecharModalInfo,
        tipoUsuario,
        setTipoUsuario,
        aceiteTermosAluno,
        aceiteTermosPersonal,
        setAceiteTermosAluno,
        setAceiteTermosPersonal,
        errors,
        estados,
        cidades,
        categoriaCref,
        showModal,
        setShowModal,
        pesquisa,
        nomePersonal,
        personais,
        redirectOnClose,
        formDataAluno,
        formDataPersonal,
        handleChange,
        handlePesquisa,
        handleSelecionado,
        handleSubmit,
    };
}
