import { useEffect, useState } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [tarefas, setTarefas] = useState([])
  const [novoTitulo, setNovoTitulo] = useState("")
  const [editandoTitulo, setEditandoTitulo] = useState("")
  const [editandoId, setEditandoId] = useState("")

  const buscarTarefas = () => {
    axios.get('http://localhost:5000/tarefas')
      .then(res => setTarefas(res.data))
  }

  useEffect(() => { buscarTarefas() }, [])

  const salvarEdicao = async (id) => {
     try {
    await axios.put(`http://localhost:5000/tarefas/${id}`, { 
    titulo: editandoTitulo 
    });
    toast.success('Tarefa Editada!');
  } catch (error) {
    toast.error('Erro ao Editar tarefa.');
  }
  setEditandoId(null);
  buscarTarefas();    
};

const adicionarTarefa = async (e) => {
  e.preventDefault();
  if (!novoTitulo.trim()) return;
  try {
    await axios.post('http://localhost:5000/tarefas/nova', { titulo: novoTitulo });
    setNovoTitulo("");
    buscarTarefas();
    toast.success('Tarefa adicionada!');
  } catch (error) {
    toast.error('Erro ao adicionar tarefa.');
  }
};

const deletarTarefa = async (id) => {
  const confirmou = window.confirm("Tem certeza que deseja excluir esta meta?");

  if(confirmou) {
    try {
      await axios.delete(`http://localhost:5000/tarefas/${id}`);
      buscarTarefas();
      toast.success('Tarefa removida!', { icon: '🗑️' });
    } catch (error) {
      toast.error('Erro ao remover.');
    }
  }
};

return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Toaster position="top-right" />
    
    <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-10 border border-gray-50">
      
      <h1 className="text-3xl font-black text-gray-800 mb-2">Minhas Metas 🎯</h1>
      <p className="text-gray-400 mb-8">Organize seu dia com eficiência</p>

      <div className="flex gap-2 mb-10">
        <input 
          className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 shadow-inner outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nova tarefa..."
          style={{ color: "black" }}
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
        />
        <button onClick={adicionarTarefa} className="bg-blue-600 text-white w-12 h-12 rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
          +
        </button>
      </div>

      <div className="space-y-4">
        {tarefas.length > 0 ? (tarefas.map((t) => (
          <div key={t.id} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all duration-300">
            
            {editandoId === t.id ? (
              // MODO EDIÇÃO
              <div className="flex gap-3 w-full">
                <input 
                  className="flex-1 bg-gray-50 border-2 border-blue-400 rounded-xl px-4 py-1 outline-none text-gray-700"
                  value={editandoTitulo} 
                  onChange={(e) => setEditandoTitulo(e.target.value)}
                  autoFocus
                />
                <button onClick={() => salvarEdicao(t.id)} className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-600 transition-colors">
                  ✔
                </button>
                <button onClick={() => setEditandoId(null)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors">
                  ✕
                </button>
              </div>
            ) : (
              // MODO VISUALIZAÇÃO
              <>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-700 font-semibold text-lg">{t.titulo}</span>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => { setEditandoId(t.id); setEditandoTitulo(t.titulo); }}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deletarTarefa(t.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))) : (
          <div className="text-center py-10 opacity-60">
            <div className="text-5xl mb-4">✨</div>
            <p className="font-medium text-gray-500">Tudo certo por aqui!</p>
            <p className="text-sm text-gray-400">Que tal adicionar uma nova meta para hoje?</p>
          </div>
        )}
      </div>

    </div>
  </div>
);
}

export default App