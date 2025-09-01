import { useState, useCallback, useEffect } from "react";
import { useAuthentication } from "context/Authentication";

export default function useLogin() {
    const { signIn } = useAuthentication();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("aluno");

    const [showModalInfo, setShowModalInfo] = useState(false);
    const [modalInfoMessage, setModalInfoMessage] = useState("");

    const exibirModalInfo = (mensagem) => {
        setModalInfoMessage(mensagem);
        setShowModalInfo(true);
    };

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            try {
                await signIn({ usuario, senha, tipoUsuario });
                
                if (tipoUsuario === "aluno") {
                    window.location.href = "/exercicio";
                } else if (tipoUsuario === "personal") {
                    window.location.href = "/historico-exercicios";
                }
            } catch (error) {
                exibirModalInfo("Login e/ou senha inválidos!");
            }
        },
        [usuario, senha, tipoUsuario, signIn]
    );

    useEffect(() => {
        localStorage.removeItem("@AuthToken_APE");
    }, []);

    return {
        usuario,
        setUsuario,
        senha,
        setSenha,
        tipoUsuario,
        setTipoUsuario,
        handleSubmit,
        showModalInfo,
        setShowModalInfo,
        modalInfoMessage,
    };
}
