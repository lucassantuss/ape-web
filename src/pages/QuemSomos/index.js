import "./QuemSomos.css";

export default function QuemSomos() {
    return (
        <div className="quem-somos-page">
            <h1 className="quem-somos-title">Quem Somos</h1>
            <section className="quem-somos-content">
                <p className="quem-somos-text">
                    A APE - Assistente Pessoal de Exercícios é uma ferramenta tecnológica 
                    desenvolvida para apoiar profissionais de educação física no acompanhamento 
                    da execução dos treinos de seus alunos. Utilizamos visão computacional 
                    para identificar pontos corporais e comparar os movimentos em tempo real 
                    com um modelo ideal, facilitando a correção de postura e a melhoria do 
                    desempenho físico.
                </p>
                <h2 className="quem-somos-subtitle">Nossa Missão</h2>
                <p className="quem-somos-text">
                    Nossa missão é oferecer ao personal trainer uma ferramenta inteligente 
                    e acessível que potencialize o acompanhamento técnico dos alunos, 
                    garantindo mais precisão, segurança e eficiência nos treinos.
                </p>
                <h2 className="quem-somos-subtitle">Nossa Visão</h2>
                <p className="quem-somos-text">
                    Nossa visão é ser a principal aliada dos profissionais de educação física 
                    na era digital, oferecendo soluções baseadas em tecnologia que elevem a 
                    qualidade do ensino e da prática de exercícios físicos.
                </p>
                <h2 className="quem-somos-subtitle">Nossos Valores</h2>
                <ul className="quem-somos-values">
                    <li>Privacidade e Ética com Dados</li>
                    <li>Inovação com Propósito</li>
                    <li>Compromisso com a Saúde e o Desempenho</li>
                </ul>
            </section>
        </div>
    );
}