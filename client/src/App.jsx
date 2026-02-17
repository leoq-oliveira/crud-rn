import { useEffect, useState } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [tarefas, setTarefas] = useState([])
  const [novoTitulo, setNovoTitulo] = useState("")
  const [editandoTitulo, setEditandoTitulo] = useState("")
  const [editandoId, setEditandoId] = useState("")
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);

    const buscarTarefas = () => {
      axios.get('http://localhost:5000/tasks')
        .then(res => setTarefas(res.data))
    }

    useEffect(() => { buscarTarefas() }, [])

    const salvarEdicao = async (id) => {
      try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { 
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
      await axios.post('http://localhost:5000/tasks', { titulo: novoTitulo });
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
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        buscarTarefas();
        toast.success('Tarefa removida!', { icon: '🗑️' });
      } catch (error) {
        toast.error('Erro ao remover.');
      }
    }
  };

  const confirmarExclusao = (id) => {
    setTarefaParaExcluir(id);
    setModalAberto(true);
  };

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${tarefaParaExcluir}`);
      buscarTarefas();
      toast.success('Tarefa removida!');
    } catch (error) {
      toast.error('Erro ao remover.');
    } finally {
      setModalAberto(false);
      setTarefaParaExcluir(null);
    }
  };

  const alternarStatus = async (id, estadoAtual) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        feita: !estadoAtual
      });

      buscarTarefas();
    } catch (error) {
      toast.error('Erro ao atualizar status.');
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
          <div key={t._id} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all duration-300">
           
          <div className="inline-flex items-center relative">
            <input
              type="checkbox"
              className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
              checked={t.feita}
              onChange={() => alternarStatus(t._id, t.feita)}
            />

            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
            </span>
          </div>
            
            {editandoId === t._id ? (
              // MODO EDIÇÃO
              <div className="flex gap-3 w-full">
                <input 
                  className="flex-1 bg-gray-50 border-2 border-blue-400 rounded-xl px-4 py-1 outline-none text-gray-700"
                  value={editandoTitulo} 
                  onChange={(e) => setEditandoTitulo(e.target.value)}
                  autoFocus
                />
                <button onClick={() => salvarEdicao(t._id)} className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-600 transition-colors">
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
                    onClick={() => { setEditandoId(t._id); setEditandoTitulo(t.titulo); }}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => confirmarExclusao(t._id)} // Alterado aqui
                    className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-colors"
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
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl scale-in-center border border-gray-100">
            <div className="text-center">
              <div className="text-4xl mb-4 text-red-500">⚠️</div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Tem certeza?</h3>
              <p className="text-gray-500 mb-8 font-medium">
                Essa ação não poderá ser desfeita. Deseja mesmo excluir esta meta?
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setModalAberto(false)}
                  className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executarExclusao}
                  className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
);
}

export default App