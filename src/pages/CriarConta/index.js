import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthentication } from "context/Authentication";
import Modal from 'components/Modal';
import Input from 'components/Input';
import SearchInput from 'components/SearchInput';
import Button from 'components/Button';
import Title from 'components/Title';
import api from 'services/api';

import './CriarConta.css';
import Select from '../../components/Select';

const CriarConta = () => {
    const { userLogged } = useAuthentication();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState("aluno");
    const [pesquisa, setPesquisa] = useState('');
    const [nomePersonal, setNomePersonal] = useState('');

    //teste
    const [resposta, setResposta] = useState({
        Mensagem: '',
        Sucesso: ''
    });

    const personais = [
        { id: 1, nomeCompleto: 'Carlos Silva' },
        { id: 2, nomeCompleto: 'Mariana Costa' },
        { id: 3, nomeCompleto: 'João Moraes' },
        { id: 4, nomeCompleto: 'Amanda Ribeiro' },
        { id: 5, nomeCompleto: 'Pedro Fernandes' }
    ];

    const [formDataAluno, setFormDataAluno] = useState({
        nome: '',
        usuario: '',
        email: '',
        cpf: '',
        senha: '',
        confSenha: '',
        idPersonal: ''
    });

    const [formDataPersonal, setFormDataPersonal] = useState({
        nome: '',
        usuario: '',
        senha: '',
        confSenha: '',
        email: '',
        cpf: '',
        cref: '',
        estado: '',
        cidade: ''
    });

    // Fora do componente, ou no início dele
    const estado = [
        { value: 'SP', label: 'São Paulo' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'MG', label: 'Minas Gerais' },
    ];

    const cidade = [
        { value: 'sao-paulo', label: 'São Paulo' },
        { value: 'campinas', label: 'Campinas' },
        { value: 'rj', label: 'Rio de Janeiro' },
    ];


    // Função para buscar os dados da API
    const fetchData = async () => {
        try {
            // Requisição para listar categorias
            //const categoriasResponse = await api.get('Categoria/ListarCategorias');
            //setCategorias(categoriasResponse.data.map(categoria => ({
            //    value: categoria.idCategoria,
            //    label: categoria.nomeCategoria
            //})));
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    };

    // Carregar os dados assim que o componente for montado
    useEffect(() => {
        fetchData();
    }, []);

    function formatarCPF(valor) {
        // Remove tudo que não for número
        valor = valor.replace(/\D/g, '');

        // Aplica a máscara
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        return valor;
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;

        return resto === parseInt(cpf[10]) ? true : false;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        let novoValor;
        if (name === 'cpf') {
            novoValor = formatarCPF(value);

            if (tipoUsuario == "aluno") {
                setFormDataAluno({ ...formDataAluno, [name]: novoValor });
            }
            else if (tipoUsuario == "personal") {
                setFormDataPersonal({ ...formDataPersonal, [name]: value });
            }
        }
        else {
            if (tipoUsuario == "aluno") {
                setFormDataAluno({ ...formDataAluno, [name]: value });
            }
            else if (tipoUsuario == "personal") {
                setFormDataPersonal({ ...formDataPersonal, [name]: value });
            }
        }
        setErrors({ ...errors, [name]: '' }); // Limpar erro quando o campo for alterado
    };

    // Função para validar os campos do formulário
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
        
        // Verificando se os campos obrigatórios estão preenchidos
        if (tipoUsuario == "aluno") {
            if (!formDataAluno.nome) {
                newErrors.nome = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataAluno.usuario) {
                newErrors.usuario = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataAluno.email) {
                newErrors.email = 'Campo obrigatório';
                isValid = false;
            } else if (!validateEmail(formDataAluno.email)) {
                newErrors.email = 'Email inválido';
                isValid = false;
            }

            if (!formDataAluno.cpf) {
                newErrors.cpf = 'Campo obrigatório';
                isValid = false;
            } else if (!validarCPF(formDataAluno.cpf)) {
                newErrors.cpf = 'CPF inválido';
                isValid = false;
            }

            if (!formDataAluno.senha) {
                newErrors.senha = 'Campo obrigatório';
                isValid = false;
            } else if (formDataAluno.senha != formDataAluno.confSenha) {
                newErrors.senha = 'Os campos de senha não batem';
                newErrors.confSenha = 'Os campos de senha não batem';
                isValid = false;
            }

            if (!formDataAluno.confSenha) {
                newErrors.confSenha = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataAluno.idPersonal) {
                newErrors.personal = 'Campo obrigatório';
                isValid = false;
            }
        }
        else if (tipoUsuario == "personal") {
            if (!formDataPersonal.nome) {
                newErrors.nome = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataPersonal.usuario) {
                newErrors.usuario = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataPersonal.email) {
                newErrors.email = 'Campo obrigatório';
                isValid = false;
            } else if (!validateEmail(formDataPersonal.email)) {
                newErrors.email = 'Email inválido';
                isValid = false;
            }

            if (!formDataPersonal.confSenha) {
                newErrors.senha = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataPersonal.confSenha) {
                newErrors.confSenha = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataPersonal.cpf) {
                newErrors.cpf = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataPersonal.cref) {
                newErrors.cref = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataPersonal.estado) {
                newErrors.estado = 'Campo obrigatório';
                isValid = false;
            }

            if (!formDataPersonal.cidade) {
                newErrors.cidade = 'Campo obrigatório';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Função para chamar a API e salvar o usuário
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validando o formulário
        if (!validateForm()) {
            return; // Se o formulário não for válido, não enviaremos os dados
        }

        try {
            // Fazendo o POST para a API
            var novoUsuarioDto;
            var response = '';
            
            if (tipoUsuario == "aluno") {
                novoUsuarioDto = {
                    //Perfil: formDataAluno.perfil,
                    //Id:0,
                    Usuario: formDataAluno.usuario,
                    Nome: formDataAluno.nome,
                    Email: formDataAluno.email,
                    CPF: formDataAluno.cpf,
                    Senha: formDataAluno.senha,
                    IdPersonal: formDataAluno.idPersonal
                };
                console.log("Enviando para API:", JSON.stringify(novoUsuarioDto, null, 2));
                response = await api.post('Aluno/CriarAluno', novoUsuarioDto);
                debugger;
            }
            else if (tipoUsuario == "personal") {
                novoUsuarioDto = {
                    //Perfil: formDataPersonal.perfil,
                    Nome: formDataPersonal.nome,
                    Usuario: formDataPersonal.usuario,
                    Senha: formDataPersonal.senha,
                    Email: formDataPersonal.email,
                    CPF: formDataPersonal.cpf,
                    CREF: formDataPersonal.cref,
                    Estado: formDataPersonal.estado,
                    Cidade: formDataPersonal.cidade
                };

                response = await api.post('Personal/CriarPersonal', novoUsuarioDto);
            }
            //if (response.status === 201) {
            if (response.data.sucesso) {
                alert('Usuário ' + tipoUsuario + ' criado com sucesso!');
                // Limpar o formulário após salvar
                setFormDataAluno({
                    nome: '',
                    usuario: '',
                    email: '',
                    cpf: '',
                    senha: '',
                    confSenha: '',
                    personal: ''
                });

                setFormDataPersonal({
                    nome: '',
                    usuario: '',
                    senha: '',
                    confSenha: '',
                    email: '',
                    cpf: '',
                    cref: '',
                    estado: '',
                    cidade: ''
                });

                navigate('/login');
            }
        } catch (error) {
            alert('Erro ao criar usuário. Tente novamente.');
        }
    };

    const resultadosFiltrados = personais.filter((p) =>
        p.nomeCompleto.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const handlePesquisa = (event) => {
        setPesquisa(event.target.value);
    };

    const handleSelecionado = (event) => {
        const personal = personais.find((p) => p.id === parseInt(event.target.value));
        setNomePersonal(personal.nomeCompleto);

        setFormDataAluno((prevFormData) => ({
            ...prevFormData, idPersonal: personal.id
        }));
    };


    return (
        <div className="cadastro-usuario-container">
            {
                userLogged() ? (
                    <Link to="/parcerias">
                        <Title titulo="Você já está logado!" titulo2="Para criar uma nova conta é necessário estar deslogado" />
                    </Link>
                ) : (
                    tipoUsuario == "aluno" ? (
                        <>
                            <Title titulo="Cadastro de Contas" />

                            <div className="login-tabs">
                                <button
                                    type="button"
                                    className={tipoUsuario === "aluno" ? "tab active" : "tab"}
                                    onClick={() => {
                                        setTipoUsuario("aluno");
                                    }}

                                >
                                    Aluno
                                </button>
                                <button
                                    type="button"
                                    className={tipoUsuario === "personal" ? "tab active" : "tab"}
                                    onClick={() => {
                                        setTipoUsuario("personal");
                                    }}
                                >
                                    Personal Trainer
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Nome"
                                    name="nome"
                                    value={formDataAluno.nome}
                                    onChange={handleChange}
                                    placeholder="Digite o nome completo"
                                    maxLength={100}
                                    error={errors.nome}
                                />

                                <Input
                                    label="Usuário"
                                    name="usuario"
                                    value={formDataAluno.usuario}
                                    onChange={handleChange}
                                    placeholder="Digite o usuário"
                                    maxLength={100}
                                    error={errors.usuario}
                                />

                                <Input
                                    label="Senha"
                                    name="senha"
                                    value={formDataAluno.senha}
                                    onChange={handleChange}
                                    placeholder="Digite a senha"
                                    type="password"
                                    maxLength={100}
                                    error={errors.senha}
                                />

                                <Input
                                    label="Confirmar Senha"
                                    name="confSenha"
                                    value={formDataAluno.confSenha}
                                    onChange={handleChange}
                                    placeholder="Confirme a senha"
                                    type="password"
                                    maxLength={100}
                                    error={errors.confSenha}
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    value={formDataAluno.email}
                                    onChange={handleChange}
                                    placeholder="Digite o email"
                                    maxLength={255}
                                    error={errors.email}
                                />

                                <Input
                                    label="CPF"
                                    name="cpf"
                                    value={formDataAluno.cpf}
                                    onChange={handleChange}
                                    placeholder="Digite o cpf"
                                    maxLength={14}
                                    error={errors.cpf}
                                />

                                <SearchInput
                                    label="Personal Trainer"
                                    name="personal"
                                    value={nomePersonal}
                                    onChange={handleChange}
                                    placeholder="Pesquise seu personal"
                                    maxLength={255}
                                    error={errors.personal}
                                    onClick={() => setShowModal(true)}
                                    readOnly={true}
                                />

                                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                                    <Input
                                        label="Personal Trainer"
                                        name="personal"
                                        value=""
                                        onChange={handlePesquisa}
                                        placeholder="Pesquise seu personal"
                                        maxLength={255}
                                        error={errors.personal}
                                    />
                                    {resultadosFiltrados.length > 0 && (
                                        <select className="selectPersonal" onChange={handleSelecionado} defaultValue="" style={{ margin: '0 0 5% 0' }}>
                                            <option value="">Selecione um personal</option>
                                            {resultadosFiltrados.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nomeCompleto}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {/*<Button label="Confirmar Personal" type="submit" />*/}
                                </Modal>

                                <Button label="Cadastrar Aluno" type="submit" />
                            </form>
                        </>
                    ) : (
                        <>
                            <Title titulo="Cadastro de Contas" />

                            <div className="login-tabs">
                                <button
                                    type="button"
                                    className={tipoUsuario === "aluno" ? "tab active" : "tab"}
                                    onClick={() => {
                                        setTipoUsuario("aluno");
                                    }}

                                >
                                    Aluno
                                </button>
                                <button
                                    type="button"
                                    className={tipoUsuario === "personal" ? "tab active" : "tab"}
                                    onClick={() => {
                                        setTipoUsuario("personal");
                                    }}
                                >
                                    Personal Trainer
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Nome"
                                    name="nome"
                                    value={formDataPersonal.nome}
                                    onChange={handleChange}
                                    placeholder="Digite o nome completo"
                                    maxLength={100}
                                    error={errors.nome}
                                />

                                <Input
                                    label="Usuário"
                                    name="usuario"
                                    value={formDataPersonal.usuario}
                                    onChange={handleChange}
                                    placeholder="Digite o usuário"
                                    maxLength={100}
                                    error={errors.usuario}
                                />

                                <Input
                                    label="Senha"
                                    name="senha"
                                    value={formDataPersonal.senha}
                                    onChange={handleChange}
                                    placeholder="Digite a senha"
                                    type="password"
                                    maxLength={100}
                                    error={errors.senha}
                                />

                                <Input
                                    label="Confirmar Senha"
                                    name="confSenha"
                                    value={formDataPersonal.confSenha}
                                    onChange={handleChange}
                                    placeholder="Confirme a senha"
                                    type="password"
                                    maxLength={100}
                                    error={errors.senha}
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    value={formDataPersonal.email}
                                    onChange={handleChange}
                                    placeholder="Digite o email"
                                    maxLength={255}
                                    error={errors.email}
                                />

                                <Input
                                    label="CPF"
                                    name="cpf"
                                    value={formDataPersonal.cpf}
                                    onChange={handleChange}
                                    placeholder="Digite seu CPF"
                                    maxLength={255}
                                    error={errors.cpf}
                                />

                                <Input
                                    label="N° CREF (Conselho Regional de Educação Física)"
                                    name="cref"
                                    value={formDataPersonal.email}
                                    onChange={handleChange}
                                    placeholder="Digite seu número CREF"
                                    maxLength={255}
                                    error={errors.cref}
                                />

                                <Select
                                    label="Estado"
                                    name="estado"
                                    value={formDataPersonal.estado}
                                    onChange={handleChange}
                                    placeholder=""
                                    maxLength={255}
                                    error={errors.email}
                                    options={estado}
                                />

                                <Select
                                    label="Cidade"
                                    name="cidade"
                                    value={formDataPersonal.cidade}
                                    onChange={handleChange}
                                    placeholder="Digite o email"
                                    maxLength={255}
                                    error={errors.email}
                                    options={cidade}
                                />

                                <Button label="Cadastrar Personal" type="submit" />
                            </form>
                        </>

                    )
                )
            }
        </div >
    );
};

export default CriarConta;