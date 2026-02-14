import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [tarefas, setTarefas] = useState([])

  useEffect(() => {
    // Busca os dados na rota /tarefas que criamos no Node
    axios.get('http://localhost:5000/tarefas')
      .then(response => {
        setTarefas(response.data) // O axios já transforma o JSON em objeto JS
      })
      .catch(error => console.error("Erro ao buscar tarefas:", error))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Minhas Tarefas (Vindo do Back-end)</h1>
      <ul>
        {tarefas.map(tarefa => (
          <li key={tarefa.id} style={{ marginBottom: '10px' }}>
            {tarefa.titulo}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App