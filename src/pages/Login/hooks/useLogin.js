import { useState, useCallback, useEffect } from "react";
import { useAuthentication } from "context/Authentication";
import useModalInfo from "components/ModalInfo/hooks/useModalInfo";

export default function useLogin() {
    const { signIn } = useAuthentication();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("aluno");

    const {
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        exibirModalInfo,
        fecharModalInfo,
    } = useModalInfo();

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            try {
                await signIn({ usuario, senha, tipoUsuario });
                
                if (tipoUsuario === "aluno") {
                    window.location.href = "/exercicio";
                } else if (tipoUsuario === "personal") {
                    window.location.href = "/relatorio-resultados";
                }
            } catch (error) {
                exibirModalInfo("Erro", "Login e/ou senha inválidos!");
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
        modalInfoTitle,
        modalInfoMessage,
        fecharModalInfo,
    };
}
