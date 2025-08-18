import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "context/Authentication";
import Modal from "components/Modal";
import Input from "components/Input";
import SearchInput from "components/SearchInput";
import Button from "components/Button";
import Title from "components/Title";
import Select from "components/Select";
import useCriacaoConta from "hooks/useCriacaoConta";

import "./CriarConta.css";

export default function CriarConta() {
    const { userLogged } = useAuthentication();
    const navigate = useNavigate();

    const {
        tipoUsuario,
        setTipoUsuario,
        errors,
        estados,
        cidades,
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
    } = useCriacaoConta();

    if (userLogged()) {
        return (
            <Link to="/parcerias">
                <Title
                    titulo="Você já está logado!"
                    titulo2="Para criar uma nova conta é necessário estar deslogado"
                />
            </Link>
        );
    }

    return (
        <div className="cadastro-usuario-container">
            <Title titulo="Cadastro de Contas" />
            <div className="login-tabs">
                <button
                    type="button"
                    className={tipoUsuario === "aluno" ? "tab active" : "tab"}
                    onClick={() => setTipoUsuario("aluno")}
                >
                    Aluno
                </button>
                <button
                    type="button"
                    className={tipoUsuario === "personal" ? "tab active" : "tab"}
                    onClick={() => setTipoUsuario("personal")}
                >
                    Personal Trainer
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {tipoUsuario === "aluno" && (
                    <>
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
                            type="password"
                            value={formDataAluno.senha}
                            onChange={handleChange}
                            placeholder="Digite a senha"
                            maxLength={100}
                            error={errors.senha}
                        />

                        <Input
                            label="Confirmar Senha"
                            name="confSenha"
                            type="password"
                            value={formDataAluno.confSenha}
                            onChange={handleChange}
                            placeholder="Confirme a senha"
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
                            placeholder="Digite o CPF"
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
                            readOnly
                        />

                        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                            <Input
                                label="Pesquisar Personal"
                                name="personal"
                                value={pesquisa}
                                onChange={handlePesquisa}
                                placeholder="Digite para buscar personal"
                                maxLength={255}
                                error={errors.personal}
                            />
                            <select
                                className="selectPersonal"
                                onChange={handleSelecionado}
                                defaultValue=""
                                style={{ margin: "10px 0" }}
                            >
                                <option value="">Selecione um personal</option>
                                {personais
                                    .filter((p) =>
                                        p.nomeCompleto.toLowerCase().includes(pesquisa.toLowerCase())
                                    )
                                    .map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nomeCompleto}
                                        </option>
                                    ))}
                            </select>
                        </Modal>

                        <Button label="Cadastrar Aluno" type="submit" />
                    </>
                )}

                {tipoUsuario === "personal" && (
                    <>
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
                            type="password"
                            value={formDataPersonal.senha}
                            onChange={handleChange}
                            placeholder="Digite a senha"
                            maxLength={100}
                            error={errors.senha}
                        />

                        <Input
                            label="Confirmar Senha"
                            name="confSenha"
                            type="password"
                            value={formDataPersonal.confSenha}
                            onChange={handleChange}
                            placeholder="Confirme a senha"
                            maxLength={100}
                            error={errors.confSenha}
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
                            maxLength={14}
                            error={errors.cpf}
                        />

                        <Input
                            label="N° CREF (Conselho Regional de Educação Física)"
                            name="cref"
                            value={formDataPersonal.cref}
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
                            options={estados}
                            error={errors.estado}
                        />

                        <Select
                            label="Cidade"
                            name="cidade"
                            value={formDataPersonal.cidade}
                            onChange={handleChange}
                            options={cidades}
                            error={errors.cidade}
                        />

                        <Button label="Cadastrar Personal" type="submit" />
                    </>
                )}
            </form>
        </div>
    );
}