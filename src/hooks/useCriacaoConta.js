import { useState, useEffect } from "react";
import api from "services/api";

import { formatCPF, validateCPF } from 'utils/Validations';
import { useNavigate } from "react-router-dom";

export default function useCriacaoConta() {
    const navigate = useNavigate();

    const [tipoUsuario, setTipoUsuario] = useState("aluno");
    const [errors, setErrors] = useState({});
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [categoriaProf, setCategoriaProf] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [nomePersonal, setNomePersonal] = useState("");
    const [personais, setPersonais] = useState([]);

    const [formDataAluno, setFormDataAluno] = useState({
        nome: "",
        usuario: "",
        email: "",
        cpf: "",
        senha: "",
        confSenha: "",
        idPersonal: "",
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
        categoriaProf: "",
        cref: ""
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
            console.error("Erro ao buscar estados:", err);
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
                value: cidade.nome,
                label: cidade.nome,
            }));
            setCidades(lista);
        } catch (err) {
            console.error("Erro ao buscar cidades:", err);
        }
    };

    // Popula as categorias profissionais do CREF
    const fetchCategoriaProf = async () => {
        try {
            const categorias = [
                { value: "G", label: "G - Graduação em Educação Física" },
                { value: "P", label: "P - Provisório" },
                { value: "F", label: "F - Formação anterior à Lei 9696/98" },
            ];
            setCategoriaProf(categorias);
        } catch (err) {
            console.error("Erro ao buscar categorias:", err);
        }
    };

    // Busca personais via API
    const fetchPersonais = async () => {
        try {
            const response = await api.get("Personal/Listar");
            const lista = response.data.map(p => ({
                id: p.id,
                nomeCompleto: p.nome
            }));
            setPersonais(lista);
        } catch (err) {
            console.error("Erro ao buscar personais:", err);
        }
    };

    useEffect(() => {
        console.log("useEffect rodou");
        fetchEstados();
        fetchCategoriaProf();
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
        }

        if (tipoUsuario === "aluno" && !formData.idPersonal) {
            newErrors.personal = "Campo obrigatório";
            isValid = false;
        }
        if (
            tipoUsuario === "personal" &&
            (!formData.cref || !formData.estado || !formData.cidade)
        ) {
            if (!formData.cref) newErrors.cref = "Campo obrigatório";
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

        try {
            debugger;
            let novoUsuarioDto;
            let response;
            if (tipoUsuario === "aluno") {
                novoUsuarioDto = {
                    Usuario: formDataAluno.usuario,
                    Nome: formDataAluno.nome,
                    Email: formDataAluno.email,
                    CPF: formDataAluno.cpf,
                    Senha: formDataAluno.senha,
                    IdPersonal: formDataAluno.idPersonal,
                };
                response = await api.post("Aluno", novoUsuarioDto);
            } else {
                var crefCompleto = formDataPersonal.cref + '-' + formDataPersonal.categoriaProf + '/' + formDataPersonal.estado
                novoUsuarioDto = {
                    Id: '',
                    Nome: formDataPersonal.nome,
                    Usuario: formDataPersonal.usuario,
                    Email: formDataPersonal.email,
                    Senha: formDataPersonal.senha,
                    CPF: formDataPersonal.cpf,
                    CREF: crefCompleto,
                    Estado: formDataPersonal.estado,
                    Cidade: formDataPersonal.cidade
                };
                response = await api.post("Personal/Criar", novoUsuarioDto);
            }
            if (response.data.resultado) {
                alert(`Usuário ${tipoUsuario} criado com sucesso!`);

                setFormDataAluno({
                    nome: "",
                    usuario: "",
                    email: "",
                    cpf: "",
                    senha: "",
                    confSenha: "",
                    idPersonal: "",
                });

                setFormDataPersonal({
                    nome: "",
                    usuario: "",
                    senha: "",
                    confSenha: "",
                    email: "",
                    cpf: "",
                    cref: "",
                    estado: "",
                    cidade: "",
                });

                navigate("/login");
            }
        } catch (error) {
            alert("Erro ao criar usuário. Tente novamente.");
        }
    };

    return {
        tipoUsuario,
        setTipoUsuario,
        errors,
        estados,
        cidades,
        categoriaProf,
        showModal,
        setShowModal,
        pesquisa,
        nomePersonal,
        personais,
        formDataAluno,
        formDataPersonal,
        handleChange,
        handlePesquisa,
        handleSelecionado,
        handleSubmit,
    };
}
