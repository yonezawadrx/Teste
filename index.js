const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Dados em memória (simples)
let tarefas = [
  { id: 1, titulo: 'Aprender Node.js', concluida: false },
  { id: 2, titulo: 'Estudar Playwright', concluida: false }
];

// Rotas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API - Obter tarefas
app.get('/api/tarefas', (req, res) => {
  res.json(tarefas);
});

// API - Adicionar tarefa
app.post('/api/tarefas', (req, res) => {
  const { titulo } = req.body;
  
  if (!titulo) {
    return res.status(400).json({ erro: 'Título é obrigatório' });
  }

  const novasTarefa = {
    id: Math.max(...tarefas.map(t => t.id), 0) + 1,
    titulo,
    concluida: false
  };

  tarefas.push(novasTarefa);
  res.status(201).json(novasTarefa);
});

// API - Atualizar tarefa
app.put('/api/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { concluida } = req.body;

  const tarefa = tarefas.find(t => t.id === parseInt(id));
  
  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  tarefa.concluida = concluida;
  res.json(tarefa);
});

// API - Deletar tarefa
app.delete('/api/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const index = tarefas.findIndex(t => t.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  const tarefa = tarefas[index];
  tarefas.splice(index, 1);
  res.json(tarefa);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
