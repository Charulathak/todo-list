import { useState, useMemo, useEffect } from 'react'
import { X, Pencil } from 'lucide-react'

function App(){

  const [draft, setDraft] = useState('')
  const [filterView, setFilterView] = useState('');
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  });
   const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])
  const filtered = useMemo(() => {
      if(filterView === "pending"){
        return todos.filter((t) => t.isChecked === false )
      }else if(filterView === "completed"){
        return todos.filter((t) => t.isChecked === true )
      }
      return todos
  },[todos, filterView]);

  const listCount = useMemo(() => { 
    if(filterView === "completed"){
      return `${todos.filter((t) => t.isChecked === true).length} items completed`
    }
    return `${todos.filter((t) => t.isChecked === false).length} items left`
  }, [todos, filterView])

  function addTask(){
    if(!draft || !draft.trim()) return
    const new_task = { id: Date.now(), task: draft.trim(), isChecked: false}
    setTodos((prev) => [...prev, new_task])
    setDraft(null)
    setFilterView('')
  }

  function toggleTask(t_id){
    if(!t_id) return
    setTodos((prev) => prev.map((t) => (t.id === t_id ? { ...t, isChecked: !t.isChecked} : t) ))
  }

  function editTask(t){
    if(!t) return
    setEditingId(t.id)
    setEditingText(t.task)
  }

  function saveTask(){
    if(!editingId || !editingText || !editingText.trim()) return
    setTodos((prev) => prev.map((t) => t.id === editingId ? {...t, task: editingText.trim()} : t))
    setEditingId(null)
    setEditingText('')
  }

  function deleteTask(t_id){
    if(!t_id) return
    setTodos((prev) => prev.filter((t) => (t.id !== t_id)))
    if(t_id === editingId) setEditingId(null)
  }

  function clearCompleted(){
    setTodos((prev) => prev.filter((t) => !t.isChecked))
  }

  function cancelEdit(){
    setEditingId(null)
    setEditingText('')
  }

  const hasCompleted = todos.some((t) => t.isChecked)
  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md p-6">

      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {/* Add todo */}
      <div className="flex gap-2 mb-4">
        <input
          type="text" value={draft ?? ''}
          placeholder="What needs doing?"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" onKeyDown={(e) => e.key === 'Enter' && addTask()} onChange={(e) => setDraft(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600" onClick={addTask}>
          Add
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-1 rounded text-sm cursor-pointer ${filterView === '' ? 'bg-blue-500 text-white' : 'text-gray-500'}`} onClick={() => setFilterView('')}>All</button>
        <button className={`px-3 py-1 rounded text-sm cursor-pointer ${filterView === 'pending' ? 'bg-blue-500 text-white' : 'text-gray-500'}`} onClick={() => setFilterView('pending')}>Active</button>
        <button className={`px-3 py-1 rounded text-sm cursor-pointer ${filterView === 'completed' ? 'bg-blue-500 text-white' : 'text-gray-500'}`} onClick={() => setFilterView('completed')}>Completed</button>
      </div>

      {/* Todo list */}
      <ul className="flex flex-col gap-1">

        {/* Normal item */}
        {filtered.map((t) => (
          <TodoItem 
          key={t.id}
          todo={t}
          isEditing={t.id === editingId}
          editingText={editingText}
          onToggle={toggleTask}
          onStartEdit={editTask}
          onSaveEdit={saveTask}
          onCancelEdit={cancelEdit}
          onChangeText={setEditingText}
          onDelete={deleteTask}
          />
        ))}
      </ul>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t text-sm text-gray-500">
        <span>{listCount}</span>
        <button className="cursor-pointer hover:text-gray-700 disabled:opacity-70 disabled:cursor-not-allowed" onClick={() => clearCompleted()} disabled={!hasCompleted}>Clear completed</button>
      </div>

    </div>
  )
}

function TodoItem({ todo, isEditing, editingText, onToggle, onStartEdit, onSaveEdit, onCancelEdit, onChangeText, onDelete }) {

  return (
      <li key={todo.id} className="flex items-center gap-3 py-2 border-b">
        <input className="cursor-pointer" type="checkbox" checked={todo.isChecked} onChange={() => onToggle(todo.id)}/>
        {isEditing ? (
            <input  type="text" value={editingText ?? ''} onBlur={() => onSaveEdit()} onKeyDown={(e) => {
              if(e.key === 'Enter') onSaveEdit()
              if(e.key == 'Escape') onCancelEdit()
            }} onChange={(e) => onChangeText(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" autoFocus/>
        ) : (
            <span className={`flex-1 ${todo.isChecked ? "line-through text-gray-400" : "text-gray-900"}`} onDoubleClick={() => onStartEdit(todo)}>{todo.task}</span>
        )
        }
        <button className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => onStartEdit(todo)}><Pencil size={14} /></button>
        <button className="cursor-pointer text-red-400 hover:text-red-600" onClick={() => onDelete(todo.id)}><X size={14}/></button>
      </li>
  )

}

export default App;