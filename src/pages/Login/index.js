import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "context/Authentication";
import { Link } from "react-router-dom";

import './Login.css';

export default function Login() {

    const { signIn } = useAuthentication();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("aluno"); // 'aluno' ou 'personal'

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            try {
                await signIn({ username: usuario, password: senha, tipo: tipoUsuario });
                window.location.href = "/parcerias";
            } catch (error) {
                alert("Login e/ou senha inválidos!");
            }
        },
        [usuario, senha, tipoUsuario, signIn]
    );

    useEffect(() => {
        localStorage.removeItem("@AuthToken_PackAndPromote");
    }, []);

    return (
        <div className="login-container">
            <div className="login-box-section">
                <div className="login-header">
                    <img src="/logo-branca.png" alt="Logo" className="login-logo" />
                    <h2>Login</h2>
                </div>

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

                <form onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label htmlFor="user">Usuário</label>
                        <input
                            type="text"
                            id="user"
                            placeholder="Digite o usuário"
                            onChange={(event) => setUsuario(event.target.value)}
                            required
                        />
                    </div>
                    <div className="login-input-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Digite a senha"
                            onChange={(event) => setSenha(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Entrar</button>
                </form>

                <Link to="/cadastro-loja" className="login-create-account">Criar conta</Link>
            </div>
        </div>
    );
}
