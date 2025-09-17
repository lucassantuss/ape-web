# 🏋️‍♂️ APE Web

Aplicação **React** desenvolvida para análise e acompanhamento de treinos, integrada com a [API APE](https://github.com/lucassantuss/ape-api).  
O projeto conta com **CI/CD automatizado** e está publicado na **Vercel**:  
👉 [Acesse aqui](https://ape-web.vercel.app/)

---

## 🚀 Tecnologias

- [React](https://reactjs.org/)  
- [React Router](https://reactrouter.com/)  
- [Context API](https://react.dev/reference/react/useContext)  
- [TailwindCSS](https://tailwindcss.com/)  
- [Vite](https://vitejs.dev/)  
- [Vercel](https://vercel.com/) – Deploy e CI/CD  

---

## 📦 Instalação e execução local

Clone o repositório:

    ```bash
    git clone https://github.com/lucassantuss/ape-web.git
    cd ape-web

Instale as dependências:

    ```bash
    npm install

Execute em ambiente de desenvolvimento:

    ```bash
    npm run dev

A aplicação ficará disponível em:
👉 http://localhost:5173

---

## 🛠️ Scripts disponíveis

No diretório do projeto, você pode executar:

npm run dev – Inicia o servidor de desenvolvimento

npm run build – Gera a versão de produção

npm run preview – Visualiza a build de produção localmente

npm run lint – Verifica problemas de linting no código

---

## 🔗 Integração com a API

O APE Web consome dados da APE API

Certifique-se de configurar as variáveis de ambiente no .env:

---

## ⚙️ CI/CD

O projeto possui pipeline automatizado com Vercel:

Deploy automático em cada push para a branch main

Preview Deploys para cada Pull Request

Integração contínua com feedback rápido

---

## 📌 Estrutura do Projeto

ape-web/

├── public/            # Arquivos estáticos

├── src/

│   ├── components/    # Componentes reutilizáveis

│   ├── context/       # Context API e autenticação

│   ├── pages/         # Páginas principais

│   ├── hooks/         # Hooks customizados

│   ├── services/      # Integração com API

│   ├── App.jsx        # Root da aplicação

│   └── main.jsx       # Ponto de entrada

└── package.json

---

## 👨‍💻 Contribuição

Contribuições são bem-vindas!
Para colaborar:

Faça um fork do projeto

Crie uma branch (git checkout -b feature/minha-feature)

Commit suas alterações (git commit -m 'Adiciona nova feature')

Faça push para a branch (git push origin feature/minha-feature)

Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.
Consulte o arquivo LICENSE para mais detalhes.

---

## 🌐 Deploy

👉 ape-web.vercel.app

---
