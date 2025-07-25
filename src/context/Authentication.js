import { createContext, useCallback, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Cria o contexto de autenticação para compartilhar informações de login/logout entre componentes.
const AuthenticationContext = createContext({});

const AuthenticationProvider = ({ children }) => {
    // Define o estado para armazenar o token de autenticação.
    const [token, setToken] = useState(() => {
        // Recupera o token salvo no localStorage, se existir, para persistência da sessão.
        const savedToken = localStorage.getItem("@AuthToken_APE");
        if (savedToken) {
            // Define o token no cabeçalho padrão da API.
            api.defaults.headers.authorization = `Bearer ${savedToken}`;
            return savedToken; // Retorna o token salvo.
        }
        return null; // Retorna null caso não exista um token salvo.
    });

    // Função para realizar o login do usuário.
    const signIn = useCallback(async ({ usuario, senha, tipoUsuario }) => {
        try {
            // Faz a requisição para a API enviando os dados de login.
            const response = await api.post("/Login/Entrar", {
                Usuario: usuario,
                Senha: senha,
                TipoUsuario: tipoUsuario
            });

            debugger;

            // Extrai o token e o ID do usuário da resposta da API.
            const token = response.data.token;
            const idUser = response.data.idUser;

            if (token) {
                // Atualiza o estado do token e salva-o no localStorage para persistência.
                setToken(token);
                localStorage.setItem("@AuthToken_APE", token);
                localStorage.setItem("@IdUser_APE", idUser);

                // Define o token no cabeçalho padrão da API para autenticação.
                api.defaults.headers.authorization = `Bearer ${token}`;
            } else {
                // Trata a ausência de token na resposta.
                console.error("Token não encontrado!");
            }
        } catch (error) {
            // Exibe e lança um erro caso o login falhe.
            throw new Error("Erro no login" + error.message);
        }
    }, []);

    // Função para realizar o logout do usuário.
    const signOut = useCallback(() => {
        // Limpa o token do estado e remove os dados do localStorage.
        setToken(null);
        localStorage.removeItem("@AuthToken_APE");
        localStorage.removeItem("@IdUser_APE");

        // Remove o token do cabeçalho padrão da API.
        delete api.defaults.headers.authorization;
    }, []);

    // Função para verificar se o usuário está logado.
    const userLogged = useCallback(() => {
        // Verifica a existência de um token salvo no localStorage.
        return !!localStorage.getItem("@AuthToken_APE");
    }, []);

    // Verifica automaticamente o token ao carregar a aplicação.
    useEffect(() => {
        const savedToken = localStorage.getItem("@AuthToken_APE");
        if (savedToken) {
            // Restaura o token no cabeçalho da API e no estado do componente.
            api.defaults.headers.authorization = `Bearer ${savedToken}`;
            setToken(savedToken);
        }
    }, []);

    // Provedor do contexto de autenticação que disponibiliza os valores e funções para os componentes filhos.
    return (
        <AuthenticationContext.Provider value={{ token, signIn, signOut, userLogged }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

// Hook personalizado para acessar o contexto de autenticação.
function useAuthentication() {
    const context = useContext(AuthenticationContext);
    // Lança um erro caso o hook seja usado fora do provedor de autenticação.
    if (!context) {
        throw new Error("O useAuthentication deve ser usado dentro de um AuthenticationProvider");
    }
    return context; // Retorna o contexto de autenticação.
}

export { AuthenticationProvider, useAuthentication };