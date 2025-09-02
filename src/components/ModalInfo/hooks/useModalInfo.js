import { useState } from "react";

export default function useModalInfo() {
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [modalInfoTitle, setModalInfoTitle] = useState("");
    const [modalInfoMessage, setModalInfoMessage] = useState("");
    const [redirectOnClose, setRedirectOnClose] = useState(null); // rota opcional para redirecionar

    const exibirModalInfo = (titulo, mensagem, redirect = null) => {
        setModalInfoTitle(titulo);
        setModalInfoMessage(mensagem);
        setRedirectOnClose(redirect);
        setShowModalInfo(true);
    };

    const fecharModalInfo = () => {
        setShowModalInfo(false);

        if (redirectOnClose) {
            window.location.href = redirectOnClose;
        }
    };

    return {
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        exibirModalInfo,
        fecharModalInfo,
    };
}
