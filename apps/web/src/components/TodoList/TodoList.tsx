import React, { useState, useEffect } from 'react';
import { TodoService } from '@todo/services';
import { Todo, TodoStatus, TodoPriority } from '@todo/services/src/todo/types';
import { Button } from '@todo/ui-web';

interface TodoListProps {
  apiUrl: string;
}

export const TodoList: React.FC<TodoListProps> = ({ apiUrl }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const todoService = new TodoService(apiUrl);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const fetchedTodos = await todoService.getTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    try {
      const newTodo = await todoService.createTodo({
        title: newTodoTitle,
        status: TodoStatus.TODO,
        priority: TodoPriority.MEDIUM,
      });
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const handleToggleStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === TodoStatus.DONE ? TodoStatus.TODO : TodoStatus.DONE;
      const updatedTodo = await todoService.updateTodo(todo.id!, {
        status: newStatus,
      });
      setTodos(todos.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error">{error}</div>;
  }

  return (
    <div className="todo-list" data-testid="todo-list">
      <h1>Todo List</h1>

      <div className="add-todo">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo"
          data-testid="new-todo-input"
        />
        <Button onClick={handleAddTodo} data-testid="add-todo-button">
          Add Todo
        </Button>
      </div>

      {todos.length === 0 ? (
        <p data-testid="no-todos">No todos yet. Add one above!</p>
      ) : (
        <ul className="todos">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item" data-testid={`todo-item-${todo.id}`}>
              <input
                type="checkbox"
                checked={todo.status === TodoStatus.DONE}
                onChange={() => handleToggleStatus(todo)}
                data-testid={`todo-checkbox-${todo.id}`}
              />
              <span
                className={todo.status === TodoStatus.DONE ? 'completed' : ''}
                data-testid={`todo-title-${todo.id}`}
              >
                {todo.title}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTodo(todo.id!)}
                data-testid={`todo-delete-${todo.id}`}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
