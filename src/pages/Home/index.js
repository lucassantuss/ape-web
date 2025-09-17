import { Link } from "react-router-dom";

import "./Home.css";

export default function Home() {
    return (
        <div id="home-page" className="home-page">
            <section id="home-hero" className="home-hero">
                <div className="hero-content">
                    <img src="/logo-verde.png" alt="Logo APE" id="home-logo" className="home-logo" />
                    <h1 id="home-title" className="home-title">
                        APE - Assistente Pessoal de Exercícios
                    </h1>
                    <p id="home-subtitle" className="home-subtitle">
                        Tecnologia em visão computacional para transformar seus treinos 
                        em experiências mais seguras, eficientes e inteligentes.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/login" id="btn-home-primary" className="btn-home-primary">Começar Agora</Link>
                        <Link to="/quem-somos" id="btn-home-secondary" className="btn-home-secondary">Saiba Mais</Link>
                    </div>
                </div>
            </section>

            <section id="home-about" className="home-about">
                <h2>O que é a APE?</h2>
                <p>
                    A APE foi desenvolvida para apoiar profissionais de educação física no acompanhamento 
                    técnico dos seus alunos. Nossa solução utiliza visão computacional para analisar 
                    os movimentos em tempo real, ajudando a corrigir posturas e melhorar o desempenho.
                </p>
            </section>

            <section id="home-features" className="home-features">
                <h2>Principais Recursos</h2>
                <div className="features-grid">
                    <div id="feature-1" className="feature-card">
                        <span className="feature-icon">🎥</span>
                        <h3>Avaliação em Tempo Real</h3>
                        <p>Detectamos pontos corporais e analisamos a execução dos exercícios enquanto você treina.</p>
                    </div>
                    <div id="feature-2" className="feature-card">
                        <span className="feature-icon">📊</span>
                        <h3>Histórico de Exercícios</h3>
                        <p>Acompanhe repetições, observações e desempenho ao longo do tempo.</p>
                    </div>
                    <div id="feature-3" className="feature-card">
                        <span className="feature-icon">🔒</span>
                        <h3>Privacidade Garantida</h3>
                        <p>Não armazenamos vídeos ou imagens, apenas dados essenciais para feedback em tempo real.</p>
                    </div>
                    <div id="feature-4" className="feature-card">
                        <span className="feature-icon">🧠</span>
                        <h3>Utilização de Visão Computacional</h3>
                        <p>Aplicamos visão computacional para detectar a pose humana durante a execução dos exercícios.</p>
                    </div>
                </div>
            </section>

            <section id="home-cta" className="home-cta">
                <h2>Pronto para transformar seus treinos?</h2>
                <p>Crie sua conta e comece agora mesmo!</p>
                <Link to="/login" id="btn-home-cta" className="btn-home-cta">Entrar</Link>
            </section>
        </div>
    );
}
