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
                <p>&copy; Copyright 2025 - APE - Todos os direitos reservados</p>
            </div>
        </footer>
    );
}