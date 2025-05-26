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
            <div className="login-logo-section">
                <img src="/logo-verde.png" alt="Logo" className="login-logo" />
                <h1 className="login-logo-text">ape</h1>
            </div>
            <div className="login-box-section">
                <h2>Login</h2>
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
                    {/* <Link to="/esqueci-senha" className="login-forgot-password">Esqueci minha senha</Link> */}
                    <button type="submit" className="login-button">Entrar</button>
                </form>
                <Link to="/cadastro-loja" className="login-create-account">Criar conta</Link>
            </div>
        </div>
    );
}