# 📝 App de Tarefas com Node.js e Playwright

Aplicação web simples e funcional para gerenciar tarefas, com testes automatizados usando Playwright.

## 🎯 Funcionalidades

- ✅ Adicionar novas tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Deletar tarefas
- ✅ Contador de tarefas totais e concluídas
- ✅ Interface moderna e responsiva
- ✅ API REST completa
- ✅ Testes automatizados com Playwright

## 📋 Estrutura do Projeto

```
.
├── index.js                 # Servidor Express
├── playwright.test.js       # Testes automatizados
├── public/
│   └── index.html          # Interface web
└── package.json            # Dependências
```

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

### 3. Rodar Testes (em outro terminal)

```bash
npm test
```

Os testes automatizados com Playwright irão:
- Carregar a página
- Adicionar tarefas
- Marcar como concluídas
- Deletar tarefas
- Verificar validações
- Testar a API

## 🛠️ Endpoints da API

- **GET** `/api/tarefas` - Obter todas as tarefas
- **POST** `/api/tarefas` - Criar nova tarefa
  - Body: `{ "titulo": "Minha tarefa" }`
- **PUT** `/api/tarefas/:id` - Atualizar tarefa
  - Body: `{ "concluida": true/false }`
- **DELETE** `/api/tarefas/:id` - Deletar tarefa

## 📦 Dependências

- **Express** - Framework web
- **@playwright/test** - Automação de testes

## 💡 Exemplo de Uso da API

```bash
# Obter tarefas
curl http://localhost:3000/api/tarefas

# Adicionar tarefa
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Nova tarefa"}'

# Marcar como concluída
curl -X PUT http://localhost:3000/api/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"concluida": true}'

# Deletar tarefa
curl -X DELETE http://localhost:3000/api/tarefas/1
```

## 📝 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Web framework
- **Playwright** - Automação de navegador
- **HTML/CSS/JavaScript** - Frontend

## 📄 Licença

MIT
