import { Button } from '@ui/components/button'
import { Card } from '@ui/components/card'
import { Input } from '@ui/components/input'
import { useState } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue,
        completed: false,
        createdAt: new Date(),
      }
      setTodos([...todos, newTodo])
      setInputValue('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        TODO App - Monorepo Template
      </h1>
      
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <div className="flex gap-2 mb-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new todo..."
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button onClick={addTodo}>Add</Button>
          </div>
          
          <div className="space-y-2">
            {todos.map(todo => (
              <div 
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  todo.completed ? 'bg-gray-100 text-gray-500' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4"
                  />
                  <span className={todo.completed ? 'line-through' : ''}>
                    {todo.text}
                  </span>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          
          {todos.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No todos yet. Add one above!
            </p>
          )}
        </Card>
      </div>
    </main>
  )
}
