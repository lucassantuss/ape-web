import { useState } from "react";

import "./FaqItem.css";

export default function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAnswer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="faq-item" onClick={toggleAnswer}>
            <h3 className="faq-question">{question}</h3>
            {isOpen && <p className="faq-answer">{answer}</p>}
        </div>
    );
}