import FaqItem from "components/FaqItem";

import "./Faq.css";

export default function Faq() {
    const faqs = [
        {
            question: "Como posso me cadastrar como aluno?",
            answer: "Para se cadastrar como aluno é preciso que...."
        },
        {
            question: "Como posso me cadastrar como personal?",
            answer: "Para se cadastrar como personal é preciso que...."
        },
    ];

    return (
        <div className="faq-page">
            <h1 className="faq-title">Perguntas Frequentes</h1>
            <p className="faq-subtitle">
                Aqui estão algumas respostas para dúvidas comuns sobre nossos serviços.
            </p>
            <div className="faq-content">
                {faqs.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}