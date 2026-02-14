import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [tarefas, setTarefas] = useState([])
  const [novoTitulo, setNovoTitulo] = useState("")

  const buscarTarefas = () => {
    axios.get('http://localhost:5000/tarefas')
      .then(res => setTarefas(res.data))
  }

  useEffect(() => { buscarTarefas() }, [])

  const adicionarTarefa = (e) => {
    e.preventDefault();
    if (!novoTitulo) return;

    axios.post('http://localhost:5000/tarefas/nova', { titulo: novoTitulo })
      .then(() => {
        setNovoTitulo(""); 
        buscarTarefas(); 
      })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gerenciador de Tarefas</h1>

      <form onSubmit={adicionarTarefa}>
        <input 
          value={novoTitulo} 
          onChange={(e) => setNovoTitulo(e.target.value)}
          placeholder="Digite uma nova tarefa..."
        />
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {tarefas.map(t => <li key={t.id}>{t.titulo}</li>)}
      </ul>
    </div>
  )
}

export default App