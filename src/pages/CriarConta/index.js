import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "context/Authentication";
import Button from "components/Button";
import Input from "components/Input";
import Modal from "components/Modal";
import ModalInfo from "components/ModalInfo";
import SearchInput from "components/SearchInput";
import Select from "components/Select";
import Title from "components/Title";
import useCriacaoConta from "pages/CriarConta/hooks/useCriacaoConta";

import "./CriarConta.css";

export default function CriarConta() {
    const { userLogged } = useAuthentication();
    const navigate = useNavigate();

    const {
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
    } = useCriacaoConta();

    if (userLogged()) {
        return (
            <Link to="/">
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
                <Button
                    label="Aluno"
                    type="button"
                    className={tipoUsuario === "aluno" ? "tab active" : "tab"}
                    onClick={() => setTipoUsuario("aluno")}
                    variant="info-2"
                />
                <Button
                    label="Personal Trainer"
                    type="button"
                    className={tipoUsuario === "personal" ? "tab active" : "tab"}
                    onClick={() => setTipoUsuario("personal")}
                    variant="info-2"
                />
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
                            label={"Personal Vinculado:"}
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
                            <div className="selectPersonal-group">
                                <select
                                    className="selectPersonal"
                                    onChange={handleSelecionado}
                                    value={formDataAluno.idPersonal || ""}
                                    style={{ margin: "0px" }}
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
                            </div>
                            
                        </Modal>

                        <div className="termos-container">
                            <input
                                id="aceiteTermosAluno"
                                type="checkbox"
                                checked={aceiteTermosAluno}
                                onChange={(e) => setAceiteTermosAluno(e.target.checked)}
                            />
                            <label htmlFor="aceiteTermosAluno">
                                Eu li e aceito os{" "}
                                <a
                                    href="/docs/APE - Termos de Uso e Política de Privacidade.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-termos"
                                >
                                    Termos de Uso e Política de Privacidade
                                </a>
                            </label>
                            {errors.aceiteTermos && (
                                <p className="error-message">{errors.aceiteTermosAluno}</p>
                            )}
                        </div>

                        <br></br>

                        <Button
                            label="Cadastrar Aluno"
                            type="submit"
                            variant="success"
                        />
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
                            placeholder="Digite o CPF"
                            maxLength={14}
                            error={errors.cpf}
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

                        <Select
                            label="Categoria Profissional"
                            name="categoriaCref"
                            value={formDataPersonal.categoriaCref}
                            onChange={handleChange}
                            options={categoriaCref}
                            error={errors.categoriaCref}
                        />

                        <div className="input-cref-group">
                            <label>N° CREF (Conselho Regional de Educação Física)</label>
                            <div className="input-cref-row">
                                <input
                                    className="input-cref numeroCref"
                                    id='numeroCref'
                                    type='text'
                                    name='numeroCref'
                                    value={formDataPersonal.numeroCref}
                                    onChange={handleChange}
                                    placeholder='Digite seu número CREF'
                                    maxLength={6}
                                />

                                <input
                                    className="input-cref categoriaCref"
                                    id="inputCategoriaCref"
                                    name="inputCategoriaCref"
                                    value={formDataPersonal.categoriaCref}
                                    maxLength={1}
                                    disabled
                                />

                                <input
                                    className="input-cref estado"
                                    id="inputEstado"
                                    name="inputEstado"
                                    value={formDataPersonal.estado}
                                    maxLength={2}
                                    disabled
                                />
                            </div>
                            {errors.cref && <span className="error-message">{errors.cref}</span>}
                        </div>

                        <div className="termos-container">
                            <input
                                id="aceiteTermosPersonal"
                                type="checkbox"
                                checked={aceiteTermosPersonal}
                                onChange={(e) => setAceiteTermosPersonal(e.target.checked)}
                            />
                            <label htmlFor="aceiteTermosPersonal">
                                Eu li e aceito os{" "}
                                <a
                                    href="/docs/APE - Termos de Uso e Política de Privacidade.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-termos"
                                >
                                    Termos de Uso e Política de Privacidade
                                </a>
                            </label>
                            {errors.aceiteTermos && (
                                <p className="error-message">{errors.aceiteTermosPersonal}</p>
                            )}
                        </div>

                        <br></br>

                        <Button 
                            label="Cadastrar Personal"
                            type="submit"
                            variant="success"
                        />
                    </>
                )}

                <ModalInfo
                    isOpen={showModalInfo}
                    onClose={() => {
                        fecharModalInfo();
                        if (redirectOnClose) {
                            navigate("/login");
                        }
                    }}
                    title={modalInfoTitle}
                    message={modalInfoMessage}
                />
            </form>
        </div>
    );
}