import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import { useAuthentication } from "context/Authentication";
import { Link } from "react-router-dom";

import './Rodape.css';

// Componente funcional que renderiza o rodapé do site
export default function Rodape() {
    // Extrai a função `userLogged` do contexto de autenticação, que verifica se o usuário está logado
    const { userLogged } = useAuthentication();

    return (
        // Elemento principal do rodapé
        <footer className="footer">
            {/* Div que contém as colunas do rodapé */}
            <div className="footer-columns">

                {/* Primeira coluna do rodapé */}
                <div className="footer-column">
                    <h4>
                        {/* Link para a página inicial com o nome do site */}
                        <Link to="/">APE</Link>
                    </h4>
                    <ul>
                        {/* Verifica se o usuário não está logado e exibe o link para cadastro da loja */}
                        {
                            !userLogged() && (
                                <li><Link to="/cadastro-loja">Cadastre sua loja</Link></li>
                            )
                        }
                        {/* Link para a página de planos */}
                        <li><Link to="/planos">Planos</Link></li>
                    </ul>
                </div>

                {/* Segunda coluna do rodapé */}
                <div className="footer-column">
                    <h4>Descubra</h4>
                    <ul>
                        {/* Link para a página que explica como a plataforma funciona */}
                        <li><Link to="/como-funciona">Como Funciona</Link></li>
                        {/* Link para a página sobre informações da equipe ou empresa */}
                        <li><Link to="/quem-somos">Quem Somos</Link></li>
                    </ul>
                </div>

                {/* Terceira coluna do rodapé */}
                <div className="footer-column">
                    <h4>Saiba mais</h4>
                    <ul>
                        {/* Link para a página de perguntas frequentes */}
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>
            </div>

            {/* Parte inferior do rodapé com informações adicionais */}
            <div className="footer-bottom">
                {/* Direitos autorais */}
                <p>&copy; Copyright 2024 - APE - Todos os direitos reservados</p>
                {/* Informações institucionais da empresa, como CNPJ e endereço */}
                <p>CNPJ 12.345.678/0001-23 / Estrada dos Alvarengas, 4001, São Bernardo do Campo</p>
                {/* Ícones das redes sociais */}
                <div className="footer-social">
                    <FaFacebookF /> {/* Ícone do Facebook */}
                    <FaTwitter />   {/* Ícone do Twitter */}
                    <FaYoutube />   {/* Ícone do YouTube */}
                    <FaInstagram /> {/* Ícone do Instagram */}
                </div>
            </div>
        </footer>
    );
}