const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Permite que o React acesse o Node
app.use(express.json()); // Permite que o Node entenda JSON enviado pelo React

const tarefas = [
  { id: 1, titulo: 'Aprender Node.js' },
  { id: 2, titulo: 'Aprender React' },
  { id: 3, titulo: 'Fazer o deploy' },
  { id: 4, titulo: 'Implementar Features' }
];

app.get('/tarefas', (req, res) => {
  res.json(tarefas); 
});

app.post('/tarefas/nova', (req,res) => {
  const {titulo} = req.body;

  const novaTarefa = { 
    id: Math.floor(Math.random() * 10000),
    titulo: titulo
   };

   tarefas.push(novaTarefa);
   res.status(201).json(novaTarefa);
});

app.delete('/tarefas/:id', (req,res) => {
  const { id } = req.params;

  const index = tarefas.findIndex(t => t.id === Number(id));

  if (index >= -1) {
    tarefas.splice(index, 1);
    return res.status(204).send();
  }

  res.status(404).json({ message: "Tarefa não encontrada" })

});

app.put('/tarefas/:id', (req,res) => { 
  const { id } = req.params;
  const { titulo } = req.body;

  const tarefa = tarefas.find(t => t.id === Number(id));

  if (tarefa) {
    tarefa.titulo = titulo;
    return res.json(tarefa);
  }

  res.status(404).json({ message: "Tarefa não encontrada" });
 })

app.listen(5000, () => {
  console.log('Servidor rodando em http://localhost:5000');
});