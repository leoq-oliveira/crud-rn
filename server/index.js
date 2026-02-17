require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const URI = process.env.MONGO_URI;
const mongoose = require('mongoose');

app.use(cors()); 
app.use(express.json());

mongoose.connect(URI)
  .then(() => {
    console.log("-----------------------------------------");
    console.log("Conectado ao MongoDB com sucesso! ✅");
    console.log("-----------------------------------------");
  })
  .catch(err => {
    console.error("Erro ao conectar ao MongoDB ❌");
    console.error("Detalhe do erro:", err.message);
  });

const tarefaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  concluida: { type: Boolean, default: false }
});

const Tarefa = mongoose.model('Tarefa', tarefaSchema);

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

  if (index >= 0) {
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

const Task = require('./models/Task');

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dataCriacao: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const novaTask = new Task(req.body);
    await novaTask.save();
    res.status(201).json(novaTask);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ erro: error.message});
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const taskAtualizada = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(taskAtualizada);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar" });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Tarefa removida!" });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar" });
  }
});