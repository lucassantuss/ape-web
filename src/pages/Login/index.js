import { Link } from "react-router-dom";
import Input from "components/Input";
import ModalInfo from "components/ModalInfo";
import useLogin from "pages/Login/hooks/useLogin";

import './Login.css';
import Button from "components/Button";

export default function Login() {
    const {
        usuario,
        setUsuario,
        senha,
        setSenha,
        tipoUsuario,
        setTipoUsuario,
        handleSubmit,
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        fecharModalInfo,
    } = useLogin();

    return (
        <div className="login-container">
            <div className="login-box-section">
                <div className="login-header">
                    <img src="/logo-branca.png" alt="Logo" className="login-logo" />
                    <h2>Login</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Abas de seleção */}
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

                    <div className="login-input-group">
                        <label htmlFor="user">Usuário</label>
                        <Input
                            type="text"
                            id="user"
                            placeholder="Digite o usuário"
                            value={usuario}
                            onChange={e => setUsuario(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-input-group">
                        <label htmlFor="password">Senha</label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Digite a senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        label="Entrar"
                        type="submit"
                        className="btn-login"
                        variant="info-2"
                    />
                </form>

                <Link to="/criar-conta" className="login-create-account">Criar conta</Link>
            </div>

            <ModalInfo
                isOpen={showModalInfo}
                onClose={fecharModalInfo}
                title={modalInfoTitle}
                message={modalInfoMessage}
            />
        </div>
    );
}
