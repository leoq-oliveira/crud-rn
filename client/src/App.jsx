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

  const deletarTarefa = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tarefas/${id}`);
      buscarTarefas();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      
    };
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
        {tarefas.map(t => ( 
          <li key={t.id} style={{ marginBottom: '10px' }}>
            {t.titulo}
            <button 
              onClick={() => deletarTarefa(t.id)} 
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Excluir
            </button>
          </li>))}
      </ul>
    </div>
  )
}

export default App