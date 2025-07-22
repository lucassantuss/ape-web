import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthentication } from "context/Authentication";
import InputMask from 'react-input-mask';
import Select from 'components/Select';
import CheckboxGroup from 'components/CheckboxGroup';
import TextArea from 'components/TextArea';
import Input from 'components/Input';
import Button from 'components/Button';
import Title from 'components/Title';
import api from 'services/api';

import './CriarConta.css';

const CadastroLoja = () => {
    const { userLogged } = useAuthentication();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        usuario: '',
        senha: '',
        nomeDaLoja: '',
        cnpj: '',
        endereco: '',
        telefone: '',
        email: '',
        descricaoDaLoja: '',
        categoria: '',
        publicoAlvo: [],
        idade: [],
        regiao: [],
        preferenciaParcerias: []
    });

    const [errors, setErrors] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [publicosAlvo, setPublicosAlvo] = useState([]);
    const [idades, setIdades] = useState([]);
    const [regioes, setRegioes] = useState([]);
    const [preferenciasParcerias, setPreferenciasParcerias] = useState([]);
    const [planos, setPlanos] = useState([]);

    // Fun��o para buscar os dados da API
    const fetchData = async () => {
        try {
            // Requisi��o para listar categorias
            const categoriasResponse = await api.get('Categoria/ListarCategorias');
            setCategorias(categoriasResponse.data.map(categoria => ({
                value: categoria.idCategoria,
                label: categoria.nomeCategoria
            })));

            // Requisi��o para listar faixas et�rias
            const faixasEtariasResponse = await api.get('FaixaEtaria/ListarFaixasEtarias');
            setIdades(faixasEtariasResponse.data.map(faixa => ({
                value: faixa.idFaixaEtaria,
                label: faixa.descricaoFaixaEtaria
            })));

            // Requisi��o para listar p�blicos alvo
            const publicosAlvoResponse = await api.get('PublicoAlvo/ListarPublicosAlvo');
            setPublicosAlvo(publicosAlvoResponse.data.map(publico => ({
                value: publico.idPublicoAlvo,
                label: publico.descricaoPublicoAlvo
            })));

            // Requisi��o para listar regi�es alvo
            const regioesAlvoResponse = await api.get('RegiaoAlvo/ListarRegioesAlvo');
            setRegioes(regioesAlvoResponse.data.map(regiao => ({
                value: regiao.idRegiaoAlvo,
                label: regiao.nomeRegiaoAlvo
            })));

            // Requisi��o para listar prefer�ncias de parcerias
            const preferenciasAlvoResponse = await api.get('PreferenciaAlvo/ListarPreferenciasAlvo');
            setPreferenciasParcerias(preferenciasAlvoResponse.data.map(preferencia => ({
                value: preferencia.idPreferenciaAlvo,
                label: preferencia.descricaoPreferenciaAlvo
            })));

            // Requisi��o para listar os planos
            const planosResponse = await api.get('Plano/ListarPlanos');
            setPlanos(planosResponse.data.map(plano => ({
                value: plano.idPlano,
                label: plano.nomePlano
            })));
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    };

    // Carregar os dados assim que o componente for montado
    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckboxGroupChange = (name, selectedOptions) => {
        setFormData({ ...formData, [name]: selectedOptions });
        setErrors({ ...errors, [name]: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Limpar erro quando o campo for alterado
    };

    // Fun��o para validar os campos do formul�rio
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

        // Verificando se os campos obrigat�rios est�o preenchidos
        if (!formData.usuario) {
            newErrors.usuario = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.senha) {
            newErrors.senha = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.nomeDaLoja) {
            newErrors.nomeDaLoja = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.cnpj) {
            newErrors.cnpj = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.endereco) {
            newErrors.endereco = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.telefone) {
            newErrors.telefone = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Campo obrigat�rio';
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inv�lido';
            isValid = false;
        }

        if (!formData.descricaoDaLoja) {
            newErrors.descricaoDaLoja = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.categoria) {
            newErrors.categoria = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.publicoAlvo) {
            newErrors.publicoAlvo = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.idade) {
            newErrors.idade = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.regiao) {
            newErrors.regiao = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.preferenciaParcerias) {
            newErrors.preferenciaParcerias = 'Campo obrigat�rio';
            isValid = false;
        }

        if (!formData.plano) {
            newErrors.plano = 'Campo obrigat�rio';
            isValid = false;
        }

        if (formData.publicoAlvo.length === 0) {
            newErrors.publicoAlvo = 'Selecione pelo menos uma op��o';
            isValid = false;
        }

        if (formData.idade.length === 0) {
            newErrors.idade = 'Selecione pelo menos uma op��o';
            isValid = false;
        }

        if (formData.regiao.length === 0) {
            newErrors.regiao = 'Selecione pelo menos uma op��o';
            isValid = false;
        }

        if (formData.preferenciaParcerias.length === 0) {
            newErrors.preferenciaParcerias = 'Selecione pelo menos uma op��o';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Fun��o para chamar a API e salvar o usu�rio
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validando o formul�rio
        if (!validateForm()) {
            return; // Se o formul�rio n�o for v�lido, n�o enviaremos os dados
        }

        // Criando o objeto no formato esperado pela API
        const novoUsuarioDto = {
            Login: formData.usuario,
            Senha: formData.senha,
            NomeLoja: formData.nomeDaLoja,
            EnderecoLoja: formData.endereco,
            TelefoneLoja: formData.telefone,
            EmailLoja: formData.email,
            DescricaoLoja: formData.descricaoDaLoja,
            CNPJLoja: formData.cnpj,
            IdCategoria: parseInt(formData.categoria, 10),
            IdPlano: parseInt(formData.plano, 10),
            PublicoAlvo: formData.publicoAlvo
                .filter(op => op)
                .map(op => parseInt(op, 10)),
            FaixaEtaria: formData.idade
                .filter(op => op)
                .map(op => parseInt(op, 10)),
            RegiaoAlvo: formData.regiao
                .filter(op => op)
                .map(op => parseInt(op, 10)),
            PreferenciaAlvo: formData.preferenciaParcerias
                .filter(op => op)
                .map(op => parseInt(op, 10))
        };

        try {
            // Fazendo o POST para a API
            const response = await api.post('Login/CriarUsuario', novoUsuarioDto);
            if (response.status === 201) {
                alert('Usu�rio e loja criados com sucesso!');
                // Limpar o formul�rio ap�s salvar
                setFormData({
                    usuario: '',
                    senha: '',
                    nomeDaLoja: '',
                    cnpj: '',
                    endereco: '',
                    telefone: '',
                    email: '',
                    descricaoDaLoja: '',
                    categoria: '',
                    publicoAlvo: [],
                    idade: [],
                    regiao: [],
                    preferenciaParcerias: [],
                    plano: ''
                });

                navigate('/login');
            }
        } catch (error) {
            console.error("Erro ao salvar o usu�rio:", error);
            alert('Erro ao criar usu�rio. Tente novamente.');
        }
    };

    return (
        <div className="cadastro-loja-container">
            {
                userLogged() ? (
                    <Link to="/parcerias">
                        <Title titulo="Voc� j� est� logado!" titulo2="Para criar uma nova conta � necess�rio estar deslogado" />
                    </Link>
                ) : (
                    <>
                        <Title titulo="Cadastro da Loja" />

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Usu�rio"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                                placeholder="Digite o usu�rio"
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
                                label="Nome da Loja"
                                name="nomeDaLoja"
                                value={formData.nomeDaLoja}
                                onChange={handleChange}
                                placeholder="Digite o nome da loja"
                                maxLength={100}
                                error={errors.nomeDaLoja}
                            />

                            <div className="input-group">
                                <label>CNPJ</label>
                                <InputMask
                                    mask="99.999.999/9999-99"
                                    name="cnpj"
                                    placeholder="Digite o CNPJ"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                />
                                {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
                            </div>

                            <Input
                                label="Endere�o"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                placeholder="Digite o endere�o"
                                maxLength={255}
                                error={errors.endereco}
                            />

                            <div className="input-group">
                                <label>Telefone</label>
                                <InputMask
                                    mask="(99) 99999-9999"
                                    name="telefone"
                                    placeholder="Digite o telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                />
                                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                            </div>

                            <Input
                                label="E-mail"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Digite o e-mail"
                                maxLength={100}
                                error={errors.email}
                            />

                            <TextArea
                                label="Descri��o da Loja"
                                name="descricaoDaLoja"
                                value={formData.descricaoDaLoja}
                                onChange={handleChange}
                                placeholder="Digite uma breve descri��o sobre a loja"
                                maxLength={255}
                                error={errors.descricaoDaLoja}
                            />

                            <Select
                                label="Categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                options={categorias}
                                error={errors.categoria}
                            />

                            <Select
                                label="Plano"
                                name="plano"
                                value={formData.plano}
                                onChange={handleChange}
                                options={planos}
                                error={errors.plano}
                            />

                            <CheckboxGroup
                                label="P�blico-Alvo"
                                name="publicoAlvo"
                                options={publicosAlvo}
                                selectedOptions={formData.publicoAlvo}
                                onChange={handleCheckboxGroupChange}
                                error={errors.publicoAlvo}
                            />

                            <CheckboxGroup
                                label="Idade"
                                name="idade"
                                options={idades}
                                selectedOptions={formData.idade}
                                onChange={handleCheckboxGroupChange}
                                error={errors.idade}
                            />

                            <CheckboxGroup
                                label="Regi�o"
                                name="regiao"
                                options={regioes}
                                selectedOptions={formData.regiao}
                                onChange={handleCheckboxGroupChange}
                                error={errors.regiao}
                            />

                            <CheckboxGroup
                                label="Prefer�ncia de Parcerias"
                                name="preferenciaParcerias"
                                options={preferenciasParcerias}
                                selectedOptions={formData.preferenciaParcerias}
                                onChange={handleCheckboxGroupChange}
                                error={errors.preferenciaParcerias}
                            />

                            <Button label="Cadastrar" type="submit" />
                        </form>
                    </>)}
        </div>
    );
};

export default CadastroLoja;