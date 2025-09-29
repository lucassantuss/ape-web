import FaqItem from "components/FaqItem";

import "./Faq.css";

export default function Faq() {
    const faqs = [
        {
            question: "🖥️ Preciso de algum equipamento específico para usar a APE?",
            answer: "Você precisa apenas de um dispositivo com câmera e acesso à internet. " +
                "A ferramenta funciona diretamente no navegador, sem necessidade de instalar " +
                "softwares adicionais."
        },
        {
            question: "📋 Quais exercícios são analisados pela plataforma?",
            answer: "Atualmente, a APE oferece suporte para exercícios como rosca direta, " +
                "meio agachamento, supino reto no banco, tríceps na polia com corda, cadeira flexora, " +
                "com novos movimentos sendo adicionados continuamente conforme " +
                "o feedback dos profissionais."
        },
        {
            question: "🎯 Como funcionam os treinos na APE?",
            answer: "Cada aluno seleciona quais treinos deseja executar e pode acompanhar seus " +
                "resultados, repetições, estágios e ângulos de execução."
        },
        {
            question: "🔒 Os dados dos alunos são armazenados?",
            answer: "Não armazenamos vídeos ou imagens. Apenas os dados necessários para exibir o " +
                "feedback em tempo real são utilizados durante a sessão, com total respeito à privacidade " +
                "e segurança."
        }
    ];

    return (
        <div className="faq-page">
            <h1 className="faq-title">Perguntas Frequentes</h1>
            <p className="faq-subtitle">
                Aqui estão algumas respostas para dúvidas comuns sobre o uso da APE
                e como ela pode ajudar nos treinos.
            </p>
            <div className="faq-content">
                {faqs.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}