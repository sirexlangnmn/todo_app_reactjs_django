import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import Search from './common/components/Search';
import TodoList from './common/components/TodoList';
import Filter from './common/components/Filter';

import { getTodos, postTodo, removeTodo, editTodo } from './services/api'; // Adjust the path as needed

function App() {
  const [todos, setTodos] = useState([]);
  const [errors, setErrors] = useState('');

  async function fetchTodos() {
    try {
      const todosData = await getTodos();
      setTodos(todosData); // Assuming setTodos is defined and works correctly
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array means this effect runs once on mount

  //** add todo function
  const handleAddTodo = async (data, originalTodos) => {
    try {
      const newTodo = await postTodo(data);
      setTodos([...todos, newTodo]);
    } catch (err) {
      setErrors(err.message);
      setTodos(originalTodos);
    }
  };

  const addTodo = (data) => {
    const originalTodos = [...todos];
    setTodos([
      ...todos,
      (data = {
        ...data,
        id: parseInt(todos[todos.length - 1].id) + 1,
        completed: false,
      }),
    ]);
    handleAddTodo(data, originalTodos); // Call handleAddTodo to insert data via API
  };

  //** delete function
  const handleDeleteTodo = async (id, originalTodos) => {
    const result = await removeTodo(id);
    if (result.success) {
      // Delete the corresponding todo from the state
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } else {
      setErrors(result.error);
      setTodos(originalTodos);
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    const originalTodos = [...todos];
    handleDeleteTodo(id, originalTodos); // Call handleAddTodo to insert data via API
  };

  //** update function
  const handleUpdateTodo = async (id, updatedTodo, originalTodos) => {
    const result = await editTodo(id, updatedTodo);

    if (result.success) {
      // Update the corresponding todo in the state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, ...result.updatedTodo } : todo,
        ),
      );
    } else {
      setErrors(result.error);
      setTodos(originalTodos);
    }
  };

  const updateTodo = (e, id, text, todo) => {
    e.preventDefault();

    const originalTodos = [...todos];

    const updatedUser = { ...todo, id: id, task: text, completed: false };

    setTodos(todos.map((t) => (t.id === id ? updatedUser : t)));

    const updatedTodo = { ...todo, task: text };

    handleUpdateTodo(id, updatedTodo, originalTodos);
  };

  const completeTodo = (e, id, todo) => {
    if (e.target.checked) {
      console.log('complete');

      setTodos(
        todos.map((todo) =>
          todo.id == id ? { ...todo, completed: true } : todo,
        ),
      );

      const updatedTodo = { ...todo, completed: true };

      const originalTodos = [...todos];

      handleUpdateTodo(id, updatedTodo, originalTodos);
    } else {
      console.log('NOT complete');

      setTodos(
        todos.map((todo) =>
          todo.id == id ? { ...todo, completed: false } : todo,
        ),
      );

      const updatedTodo = { ...todo, completed: false };

      const originalTodos = [...todos];

      handleUpdateTodo(id, updatedTodo, originalTodos);
    }
  };

  const filterTodo = (cat_value) => {
    if (cat_value === 'Completed') {
      setTodos(todos.filter((todo) => todo.completed === true));
    } else if (cat_value === 'Active') {
      setTodos(todos.filter((todo) => todo.completed === false));
    } else {
      fetchTodos();
    }
  };

  return (
    <div className="todo-container">
      {errors && <p>{errors}</p>}
      <Search addTodo={addTodo} />
      <Filter filter_todo={filterTodo} />
      <TodoList
        todos={todos}
        delete_todo={deleteTodo}
        update_todo={updateTodo}
        complete_todo={completeTodo}
        filter_todo={filterTodo}
      />
    </div>
  );
}

export default App;
