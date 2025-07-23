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

const CriarConta = () => {
    const { userLogged } = useAuthentication();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        perfil: '',
        nome: '',
        usuario: '',
        senha: '',
        email: '',
        personal: ''
    });

    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState("aluno");

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Limpar erro quando o campo for alterado
    };

    // Função para validar os campos do formulário
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

        // Verificando se os campos obrigatórios estão preenchidos
        if (!formData.perfil) {
            newErrors.perfil = 'Campo obrigatório';
            isValid = false;
        }

        if (!formData.nome) {
            newErrors.nome = 'Campo obrigatório';
            isValid = false;
        }

        if (!formData.usuario) {
            newErrors.usuario = 'Campo obrigatório';
            isValid = false;
        }

        if (!formData.senha) {
            newErrors.senha = 'Campo obrigatório';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Campo obrigatório';
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
            isValid = false;
        }

        if (!formData.personal) {
            newErrors.personal = 'Campo obrigatório';
            isValid = false;
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

        // Criando o objeto no formato esperado pela API
        const novoUsuarioDto = {
            Perfil: formData.perfil,
            Nome: formData.nome,
            Usuario: formData.usuario,
            Senha: formData.senha,
            Email: formData.email,
            Personal: formData.personal //pegar o ID do Personal (talvez: parseInt(formData.personal, 10))
        };

        try {
            // Fazendo o POST para a API
            const response = await api.post('Login/CriarUsuario', novoUsuarioDto);
            if (response.status === 201) {
                alert('Usuário e loja criados com sucesso!');
                // Limpar o formulário após salvar
                setFormData({
                    perfil: '',
                    nome: '',
                    usuario: '',
                    senha: '',
                    email: '',
                    personal: ''
                });

                navigate('/login');
            }
        } catch (error) {
            console.error("Erro ao salvar o usuário:", error);
            alert('Erro ao criar usuário. Tente novamente.');
        }
    };

    const [pesquisa, setPesquisa] = useState('');
    const [selecionado, setSelecionado] = useState(null);

    const personais = [
        { id: 1, nomeCompleto: 'Carlos Silva' },
        { id: 2, nomeCompleto: 'Mariana Costa' },
        { id: 3, nomeCompleto: 'João Moraes' },
        { id: 4, nomeCompleto: 'Amanda Ribeiro' },
        { id: 5, nomeCompleto: 'Pedro Fernandes' },
    ];

    const resultadosFiltrados = personais.filter((p) =>
        p.nomeCompleto.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const handlePesquisa = (event) => {
        setPesquisa(event.target.value);
    };

    const handleSelecionado = (event) => {
        const idSelecionado = parseInt(event.target.value);
        const personal = personais.find((p) => p.id === idSelecionado);
        setSelecionado(personal);
        console.log('Selecionado:', personal);
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
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Digite o nome completo"
                                    maxLength={100}
                                    error={errors.nome}
                                />

                                <Input
                                    label="Usuário"
                                    name="usuario"
                                    value={formData.usuario}
                                    onChange={handleChange}
                                    placeholder="Digite o usuário"
                                    maxLength={100}
                                    error={errors.usuario}
                                />

                                <Input
                                    label="Senha"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    placeholder="Digite a senha"
                                    type="password"
                                    maxLength={100}
                                    error={errors.senha}
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Digite o email"
                                    maxLength={255}
                                    error={errors.email}
                                />

                                <SearchInput
                                    label="Personal Trainer"
                                    name="personal"
                                    value={formData.endereco}
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
                                        value={formData.endereco}
                                        onChange={handlePesquisa}
                                        placeholder="Selecione o personal"
                                        maxLength={255}
                                        error={errors.endereco}
                                    />
                                    {resultadosFiltrados.length > 0 && (
                                        <select className="selectPersonal" onChange={handleSelecionado} defaultValue="">
                                            <option value="" disabled>Selecione um personal</option>
                                            {resultadosFiltrados.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nomeCompleto}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {selecionado && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <strong>Personal selecionado:</strong> {selecionado.nomeCompleto}
                                        </div>
                                    )}
                                </Modal>

                                <Button label="Cadastrar" type="submit" />
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
                            <h2>AQUI VAI TER AS COISAS DO PERSONAL</h2>
                        </>

                    )
                )
            }
        </div >
    );
};

export default CriarConta;