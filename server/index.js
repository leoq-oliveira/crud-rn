const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Permite que o React acesse o Node
app.use(express.json()); // Permite que o Node entenda JSON enviado pelo React

// Nosso "banco de dados" temporário
const tarefas = [
  { id: 1, titulo: 'Aprender Node.js' },
  { id: 2, titulo: 'Aprender React' },
  { id: 3, titulo: 'Fazer o deploy' },
  { id: 4, titulo: 'Implementar Features' }
];

// Rota que devolve a lista de tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas); 
});

app.listen(5000, () => {
  console.log('Servidor rodando em http://localhost:5000');
});