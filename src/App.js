import { BrowserRouter, Routes, Route } from "react-router-dom"; // Gerenciamento de rotas
import { AuthenticationProvider } from "context/Authentication"; // Provedor de autenticação

import Home from "./pages/Home";
import Login from "./pages/Login";
import MinhaConta from "pages/MinhaConta";
import Parcerias from "pages/Parcerias";
import NotFound from "pages/NotFound";

import DefaultPage from "./components/DefaultPage"; // Layout padrão
import Menu from "./components/Menu"; // Componente do menu principal
import Rodape from "components/Rodape"; // Componente do rodapé
import PrivateRoute from "utils/PrivateRoute"; // Gerenciamento de rotas privadas

import './App.css';

function App() {
  return (
    <BrowserRouter> {/* Gerenciador de rotas do React */}
      <AuthenticationProvider> {/* Provedor do contexto de autenticação */}
        <Menu /> {/* Componente fixo do menu no topo da página */}

        <Routes> {/* Definição de rotas */}          
          {/* Rotas públicas */}
          <Route path="/" element={<DefaultPage />}> {/* Layout padrão para rotas públicas */}
            <Route path="/" element={<Home />} /> {/* Página inicial */}
            <Route path="login" element={<Login />} /> {/* Página de login */}
          </Route>

          {/* Rotas protegidas */}
          {/*<Route element={<PrivateRoute role="ADMINISTRADOR,CLIENTE" />}> */}{/* Permissão necessária: ADMINISTRADOR ou CLIENTE */}
            <Route path="parcerias" element={<Parcerias />} /> {/* Página de parcerias */}
            <Route path="minha-conta" element={<MinhaConta />} /> {/* Página "Minha Conta" */}
            <Route path="logout" element={<Login />} /> {/* Logout redireciona para login */}
          {/*</Route>*/}

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<NotFound />} /> {/* Página "404 Not Found" */}
        </Routes>

        <Rodape /> {/* Componente fixo do rodapé */}
      </AuthenticationProvider>
    </BrowserRouter>
  );
}

export default App;