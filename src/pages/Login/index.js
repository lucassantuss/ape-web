import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "context/Authentication";
import { Link } from "react-router-dom";

import './Login.css';

export default function Login() {

    const { signIn } = useAuthentication();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            try {
                await signIn({ username: usuario, password: senha });
                window.location.href = "/parcerias";
            } catch (error) {
                alert("Login e/ou senha inválidos!");
            }
        },
        [usuario, senha, signIn]
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
                <form onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label htmlFor="user">Usuário</label>
                        <input 
                            type="user" 
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