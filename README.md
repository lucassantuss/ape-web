# 🏋️‍♂️ APE Web

Aplicação **React** desenvolvida para análise e acompanhamento de treinos, integrada com a [API APE](https://github.com/lucassantuss/ape-api).  
O projeto conta com **CI/CD automatizado** e está publicado na **Vercel**:  
👉 [Acesse aqui](https://ape-web.vercel.app/)

---

## 🚀 Tecnologias

- [React](https://reactjs.org/)  
- [Vercel](https://vercel.com/) – Deploy e CI/CD  

---

## 📦 Instalação e execução local

Clone o repositório:

```bash
git clone https://github.com/lucassantuss/ape-web.git
cd ape-web
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm start
```

A aplicação ficará disponível em:
👉 http://localhost:5173

---

## ⚙️ CI/CD

O projeto possui pipeline automatizado com Vercel:

- Deploy automático em cada push para a branch main
- Preview Deploys para cada Pull Request
- Integração contínua com feedback rápido

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

Contribuições são bem-vindas! Para colaborar:

- Fork este repositório
- Crie uma nova branch para sua feature ou correção (feature/nome-da-feature)
- Realize as alterações
- Submeta um Pull Request descrevendo as mudanças

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

Veja o arquivo [MIT](LICENSE) para mais detalhes.

---
