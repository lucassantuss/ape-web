import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "context/Authentication";
import Button from "components/Button";

import './Menu.css';

export default function Menu() {
    const [menuOpen, setMenuOpen] = useState(false); // Estado para abrir/fechar o menu no modo mobile.
    const { signOut } = useAuthentication(); // Contexto para realizar logout.
    const navigate = useNavigate();

    const token = localStorage.getItem("@AuthToken_APE");
    const tipoUsuario = localStorage.getItem("@UserType_APE"); // "aluno" | "personal"

    const isLogged = !!token;

    // Alterna o estado do menu (aberto ou fechado).
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Fecha o menu ao clicar em um link.
    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    // Realiza o logout e redireciona para a página inicial.
    const handleLogout = () => {
        signOut();
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <header className="menu-header">
            <nav className="menu-nav">
                <div className="menu-logo">
                    {isLogged ? (
                        <>
                            <Link to={tipoUsuario === "aluno" ? "/exercicio" : "/relatorio-resultados"}>
                                <img src="/logo-branca.png" alt="Logo" className="logo-img" />
                            </Link>
                            <Link to={tipoUsuario === "aluno" ? "/exercicio" : "/relatorio-resultados"}>APE</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/">
                                <img src="/logo-branca.png" alt="Logo" className="logo-img" />
                            </Link>
                            <Link to="/">APE</Link>
                        </>
                    )}
                </div>

                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>

                <div className={`menu-items-right ${menuOpen ? "menu-open" : ""}`}>
                    <ul className="menu-links">
                        {isLogged ? (
                            <>
                                {tipoUsuario === "aluno" && (
                                    <>
                                        <li><Link to="/exercicio" onClick={handleLinkClick}>Exercício</Link></li>
                                        <li><Link to="/historico-exercicios" onClick={handleLinkClick}>Histórico</Link></li>
                                    </>
                                )}

                                {tipoUsuario === "personal" && (
                                    <>
                                        <li><Link to="/relatorio-resultados" onClick={handleLinkClick}>Relatório</Link></li>
                                        <li><Link to="/alunos" onClick={handleLinkClick}>Gerenciar Alunos</Link></li>
                                    </>
                                )}

                                <li><Link to="/minha-conta" onClick={handleLinkClick}>Minha Conta</Link></li>
                                <li><Link to="/quem-somos" onClick={handleLinkClick}>Quem Somos</Link></li>
                                <li><Link to="/faq" onClick={handleLinkClick}>FAQ</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/quem-somos" onClick={handleLinkClick}>Quem Somos</Link></li>
                                <li><Link to="/faq" onClick={handleLinkClick}>FAQ</Link></li>
                            </>
                        )}
                    </ul>

                    <div className="menu-login">
                        {isLogged ? (
                            <Button
                                label="Sair"
                                onClick={handleLogout}
                                className="menu-login"
                                variant="info-2"
                            />
                        ) : (
                            <Link to="/login" onClick={handleLinkClick}>Entrar</Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}