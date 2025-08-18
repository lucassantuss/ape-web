import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "context/Authentication";

import './Menu.css';

export default function Menu() {
    const [menuOpen, setMenuOpen] = useState(false); // Estado para abrir/fechar o menu no modo mobile.
    const { userLogged, signOut } = useAuthentication(); // Contexto para verificar autenticação e realizar logout.
    const navigate = useNavigate();

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
                    {userLogged() ? (
                        <>
                            <Link to="/exercicio">
                                <img src="/logo-branca.png" alt="Logo" className="logo-img" />
                            </Link>
                            <Link to="/exercicio">APE</Link>
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
                        {userLogged() ? (
                            <>
                                <li><Link to="/relatorio-resultados" onClick={handleLinkClick}>Relatório de Exercícios</Link></li>
                                <li><Link to="/quem-somos" onClick={handleLinkClick}>Quem Somos</Link></li>
                                <li><Link to="/faq" onClick={handleLinkClick}>FAQ</Link></li>
                                <li><Link to="/minha-conta" onClick={handleLinkClick}>Minha Conta</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/quem-somos" onClick={handleLinkClick}>Quem Somos</Link></li>
                                <li><Link to="/faq" onClick={handleLinkClick}>FAQ</Link></li>
                            </>
                        )}
                    </ul>

                    <div className="menu-login">
                        {userLogged() ? (
                            <button className="menu-login" onClick={handleLogout}>Sair</button>
                        ) : (
                            <Link to="/login" onClick={handleLinkClick}>Entrar</Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}