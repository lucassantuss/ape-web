import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthentication } from "context/Authentication";
import api from "../services/api";

const PrivateRoute = ({ role }) => {
  // Estado para armazenar se o usuário possui as permissões necessárias
  const [permissions, setPermissions] = useState(null);
  const navigate = useNavigate();
  const { userLogged } = useAuthentication(); // Hook para verificar se o usuário está logado

  useEffect(() => {
    const loadRoles = async () => {
      try {
        // Faz a requisição para buscar os perfis do usuário
        const response = await api.get("/Login/ListarPerfis");
        const userRoles = response.data;

        // Verifica se o usuário possui algum dos perfis necessários
        const roleArray = role.split(","); // Divide as roles passadas como parâmetro em um array
        const hasRole = userRoles.some(profile =>
          roleArray.includes(profile.nomePerfil.toUpperCase()) // Compara ignorando diferenças de maiúsculas/minúsculas
        );
        setPermissions(hasRole); // Atualiza o estado de permissões
      } catch (error) {
        // Trata erros na requisição
        console.error("Erro ao carregar roles:", error);
        setPermissions(false); // Define como false em caso de erro
      }
    };

    // Carrega as permissões somente se o usuário estiver logado
    if (userLogged()) {
      loadRoles();
    } else {
      // Redireciona para a página de login caso o usuário não esteja logado
      navigate("/login");
    }
  }, [role, userLogged, navigate]);

  useEffect(() => {
    // Redireciona para a página inicial caso o usuário não tenha permissões
    if (permissions === false) {
      navigate("/");
    }
  }, [permissions, navigate]);

  // Não renderiza o conteúdo enquanto o status de permissões ou login não foi definido
  if (!userLogged() || permissions === null) {
    return null;
  }

  // Renderiza o componente filho se as permissões forem concedidas
  return permissions ? <Outlet /> : null;
};

export default PrivateRoute;