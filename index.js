const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Dados em memória (simples)
let tarefas = [
  { id: 1, titulo: 'Comer o cu do Ricardo', concluida: false },
  { id: 2, titulo: 'Arrombar o vini', concluida: false }
];

// File persistence
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'jogo.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Estado do Jogo da Velha (em memória, compartilhado entre todos os visitantes)
let jogoDaVelha = {
  board: Array(9).fill(''), // 9 posições: '', 'X' ou 'O'
  current: 'X',             // jogador atual
  winner: null,             // 'X', 'O', 'draw' ou null
  scores: { X: 0, O: 0 }
};

function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8');
      const parsed = JSON.parse(raw);
      jogoDaVelha = Object.assign(jogoDaVelha, parsed);
    }
  } catch (e) {
    console.error('Erro ao ler arquivo de dados:', e.message);
  }
}

function saveData() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(jogoDaVelha, null, 2), 'utf8');
  } catch (e) {
    console.error('Erro ao salvar arquivo de dados:', e.message);
  }
}

function checkWinner(board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return 'draw';
  return null;
}

// carregar estado salvo
loadData();

// API - Obter estado do jogo
app.get('/api/jogo', (req, res) => {
  res.json(jogoDaVelha);
});

// API - Fazer uma jogada
app.post('/api/jogo/move', (req, res) => {
  const { index } = req.body;
  if (typeof index !== 'number' || index < 0 || index > 8) {
    return res.status(400).json({ erro: 'Index inválido' });
  }
  if (jogoDaVelha.winner) {
    return res.status(400).json({ erro: 'Jogo já finalizado', winner: jogoDaVelha.winner });
  }
  if (jogoDaVelha.board[index]) {
    return res.status(400).json({ erro: 'Posição já ocupada' });
  }

  jogoDaVelha.board[index] = jogoDaVelha.current;
  // checar vencedor
  const result = checkWinner(jogoDaVelha.board);
  if (result) {
    jogoDaVelha.winner = result;
    if (result === 'X' || result === 'O') jogoDaVelha.scores[result] = (jogoDaVelha.scores[result] || 0) + 1;
  } else {
    jogoDaVelha.current = jogoDaVelha.current === 'X' ? 'O' : 'X';
  }

  saveData();
  res.json(jogoDaVelha);
});

// API - Resetar jogo
app.post('/api/jogo/reset', (req, res) => {
  const { starter } = req.body || {};
  jogoDaVelha.board = Array(9).fill('');
  jogoDaVelha.current = starter === 'O' ? 'O' : 'X';
  jogoDaVelha.winner = null;
  saveData();
  res.json(jogoDaVelha);
});

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

// Iniciar servidor normalmente
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
