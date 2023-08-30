// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getTodos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};


const postTodo = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todos`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeTodo = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const editTodo = async (id, updatedTodoData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updatedTodoData);
    return { success: true, updatedTodo: response.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export { getTodos, postTodo, removeTodo, editTodo };