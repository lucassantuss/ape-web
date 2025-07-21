import "./QuemSomos.css";

export default function QuemSomos() {
    return (
        <div className="quem-somos-page">
            <h1 className="quem-somos-title">Quem Somos</h1>
            <section className="quem-somos-content">
                <p className="quem-somos-text">
                    Somos uma plataforma que para auxiliar alunos na execução de exercícios
                </p>
                <h2 className="quem-somos-subtitle">Nossa Missão</h2>
                <p className="quem-somos-text">
                    Nossa missão é ....
                </p>
                <h2 className="quem-somos-subtitle">Nossa Visão</h2>
                <p className="quem-somos-text">
                    Nossa visão é ....
                </p>
                <h2 className="quem-somos-subtitle">Nossos Valores</h2>
                <ul className="quem-somos-values">
                    <li>Integridade e Transparência</li>
                    <li>Saúde e Bem-Estar</li>
                    <li>Inovação e Crescimento Coletivo</li>
                </ul>
            </section>
        </div>
    );
}