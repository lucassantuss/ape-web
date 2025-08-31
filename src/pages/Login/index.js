import { Link } from "react-router-dom";
import Modal from "components/Modal";
import Input from "components/Input";
import Button from "components/Button";
import useLogin from "hooks/useLogin";
import './Login.css';

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
        setShowModalInfo,
        modalInfoMessage
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
                    <button type="submit" className="login-button">Entrar</button>
                </form>

                <Link to="/criar-conta" className="login-create-account">Criar conta</Link>
            </div>

            <Modal isOpen={showModalInfo} onClose={() => setShowModalInfo(false)}>
                <h3>Erro!</h3>
                <p>{modalInfoMessage}</p>
                <div className="minha-conta-modal-botoes">
                    <Button label="OK" onClick={() => setShowModalInfo(false)} />
                </div>
            </Modal>
        </div>
    );
}
