import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import { Link } from "react-router-dom";

import './Rodape.css';

export default function Rodape() {
    return (
        <footer className="footer">
            <div className="footer-columns">

                <div className="footer-column">
                    <h4>
                        <Link to="/">APE</Link>
                    </h4>
                </div>

                <div className="footer-column">
                    <h4>Descubra</h4>
                    <ul>
                        <li><Link to="/quem-somos">Quem Somos</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Saiba mais</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                {/* Direitos autorais */}
                <p>&copy; Copyright 2025 - APE - Todos os direitos reservados</p>
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