import { BrowserRouter, Routes, Route } from "react-router-dom"; // Gerenciamento de rotas
import { AuthenticationProvider } from "context/Authentication"; // Provedor de autenticação

import Home from "./pages/Home";
import Login from "./pages/Login";
import MinhaConta from "pages/MinhaConta";
import NotFound from "pages/NotFound";
import CriarConta from "pages/CriarConta";
import HistoricoExercicio from "pages/HistoricoExercicio"

import DefaultPage from "./components/DefaultPage"; // Layout padrão
import Menu from "./components/Menu"; // Componente do menu principal
import Rodape from "components/Rodape"; // Componente do rodapé
import PrivateRoute from "utils/PrivateRoute"; // Gerenciamento de rotas privadas

import './App.css';
import Alunos from "pages/Alunos";
import Exercicio from "pages/Exercicio";
import Faq from "pages/Faq";
import QuemSomos from "pages/QuemSomos";
import RelatorioResultados from "pages/RelatorioResultados";
import ScrollToTop from "components/ScrollToTop";

function App() {
  return (
    <BrowserRouter> {/* Gerenciador de rotas do React */}
      <AuthenticationProvider> {/* Provedor do contexto de autenticação */}
        <ScrollToTop />
        <Menu /> {/* Componente fixo do menu no topo da página */}

        <Routes> {/* Definição de rotas */}
          {/* Rotas públicas */}
          <Route path="/" element={<DefaultPage />}> {/* Layout padrão para rotas públicas */}
            <Route path="/" element={<Home />} /> {/* Página inicial */}
            <Route path="/quem-somos" element={<QuemSomos />} /> {/* Quem Somos */}
            <Route path="/faq" element={<Faq />} /> {/* FAQ */}
            <Route path="/login" element={<Login />} /> {/* Página de login */}
            <Route path="/criar-conta" element={<CriarConta />} /> {/* Logout redireciona para login */}
          </Route>

          {/* Rotas protegidas ALUNO e PERSONAL */}
          <Route element={<PrivateRoute allowedTypes={["aluno", "personal", "administrador"]} />}> {/* Permissão necessária: ADMINISTRADOR, PERSONAL ou ALUNO */}
            <Route path="/minha-conta" element={<MinhaConta />} /> {/* Página "Minha Conta" */}
          </Route>

          {/* Rotas protegidas ALUNO */}
          <Route element={<PrivateRoute allowedTypes={["aluno", "administrador"]} />}> {/* Permissão necessária: ADMINISTRADOR ou ALUNO */}
            <Route path="/exercicio" element={<Exercicio />} /> {/* Página de exercícios */}
            <Route path="/historico-exercicios" element={<HistoricoExercicio />} /> {/* Página de histórico de exercícios */}
          </Route>

          {/* Rotas protegidas PERSONAL */}
          <Route element={<PrivateRoute allowedTypes={["personal", "administrador"]} />}> {/* Permissão necessária: ADMINISTRADOR ou CLIENTE */}
            <Route path="/alunos" element={<Alunos />} /> {/* Página de Aluno Vinculados */}
            <Route path="/relatorio-resultados" element={<RelatorioResultados />} /> {/* Página "Relatório de Resultados */}
          </Route>

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<NotFound />} /> {/* Página "404 Not Found" */}
        </Routes>

        <Rodape /> {/* Componente fixo do rodapé */}
      </AuthenticationProvider>
    </BrowserRouter>
  );
}

export default App;