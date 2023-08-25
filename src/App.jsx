import { useState, useEffect } from "react";
import axios from 'axios'
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Search from "./components/Search";
import TodoList from "./components/TodoList";
import Filter from "./components/Filter";

function App() {
  // const [todos, setTodos] = useState([
  //   { id: 0, task: "Learn JavaScript", status: "Active" },
  //   { id: 1, task: "Read a self-help book", status: "Active" },
  //   { id: 2, task: "Play PS5", status: "Active" },
  //   { id: 3, task: "Watch YouTube videos", status: "Active" },
  //   // { id: 5, task: "Pray to God", status: "Active" },
  // ]);

  /**
  ** The useState hook is used to initialize two pieces of state:
  **
  ** `todos`: This state variable will hold an array representing a list of "todos" or tasks.
  ** `setTodos`: This function is used to update the todos state.
  ** `errors`: This state variable will hold an error message in case there's an issue with the HTTP request.
  ** `setErrors`: This function is used to update the errors state.
  */
  const [todos, setTodos] = useState([]);
  const [errors, setErrors] = useState("");

  /**
  ** The `useEffect` hook is used to perform side effects in React components.
  ** In this case, it's used to fetch data from a specific URL when the component is mounted (initialized).
  ** The empty array `[]` passed as the second argument to `useEffect` means that this effect will only run once,
  ** right after the initial rendering.
  **
  ** Inside the useEffect:
  ** An Axios GET request is made to 'http://127.0.0.1:8000/todos', to retrieve a list of todos from a server.
  ** If the request is successful,
  ** the data returned by the server (the list of todos) is set using the setTodos function.
  ** If the request encounters an error, the error message is set using the setErrors function.
  */
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/todos')
    .then(res => setTodos(res.data))
    .catch(err => setErrors(err.message))
  }, [])

  //** add todo function
  const addTodo = (data) => {
    console.log('App.jsx addTodo data1 : ', data )

    /**
    ** creates a copy of an array called todos.
    ** This is an array that holds the current list of todo items.
    ** The spread operator `[...todos]` is used to create a shallow copy of the array.
    */
    const originalTodos = [...todos]

    /**
    ** update the `todos` array state with a new value.
    ** It does the following:
    ** 1.) It constructs a new array by spreading the existing `todos` array using `[...todos]`.
    ** 2.) A new todo object is created using the `data` parameter along with additional properties:
    **    a.) `id`: This is calculated as the integer value of the id of the last todo item in
    **        the current todos array plus 1.
    **        This suggests that each todo item has a numerical ID, and the code assumes that IDs are incremental.
    **    b.) `status`: This is set to "Active" by default for the new todo item.
    ** 3.) The new todo object is added to the end of the array using `[...todos, ...]`.
    */


    console.log('App.jsx addTodo data2 : ', data )

    // setTodos( [ ...todos, data={...data, id:parseInt(todos[todos.length-1].id) + 1, status:"Active"}] )
    setTodos( [ ...todos, data={...data, id:parseInt(todos[todos.length-1].id) + 1, completed:false}] )

    console.log('App.jsx addTodo data3 : ', data )
    /**
    ** makes an HTTP POST request using Axios to a URL with the `data` parameter as the request body.
    ** This is an attempt to add the new todo item to a server-side and database.
    */
    axios.post('http://127.0.0.1:8000/todos', data)

    /**
    ** If the POST request is successful, this line updates the todos array state again.
    ** It adds the response data from the POST request
    ** (representing the newly added todo item from the server) to the end of the todos array.
    */
    .then(res => setTodos([...todos, res.data]))

    /**
    ** `.catch(err => { ... })`: If an error occurs during the POST request, this block of code is executed.
    ** It does the following:
    ** a.) It sets the `errors` state to the error message retrieved from
    **  the caught error using `setErrors(err.message`.
    ** b.) It restores the original state of the `todos` array by using the `originalTodos` copy created at the
    **  beginning of the function with `setTodos(originalTodos)`.
    */
    .catch(err => {
      setErrors(err.message)
      setTodos(originalTodos)
    })
  }

  //** delete function
  const deleteTodo = (id) => {
    /**
    ** This line is removing the todo with the specified `id` from the `todos` list using the `filter` method.
    ** It's assuming that `todos` is a state variable that holds the current list of todos.
    ** The `filter` method creates a new array by iterating through each todo
    ** and including only those whose `id` is not equal to the provided `id`.
    ** This filtered array is then used to update the `todos` state using the setTodos function.
    ** This step ensures that the UI reflects the deletion of the todo without needing to wait for the server response.
    */
    setTodos(todos.filter( todo => todo.id != id ))

    /**
    ** creates a copy of the current `todos` array and stores it in the `originalTodos` constant.
    ** This copy is being kept in case the subsequent API call (HTTP DELETE request) fails and
    ** the application needs to revert the state changes.
    */
    const originalTodos = [...todos]

    /**
    ** sends an HTTP DELETE request to the specified URL, presumably targeting an API endpoint for deleting todos.
    ** The `id` parameter is appended to the URL to indicate which todo item should be deleted.
    */
    axios.delete('http://127.0.0.1:8000/todos/' + id)
    .catch(err => {
      /**
      ** This sets up a catch block to handle errors that might occur during the API request.
      ** If the DELETE request encounters an error, the provided callback function will be executed.
      **
      ** In case there is an error. The error message from the caught error is being stored in a state variable
      **  called `errors` or in my case `err` for short.
      ** This could be used to display an error message to the user in the UI.
      */
      setErrors(err.message)

      /**
      ** If an error occurs during the DELETE request,
      ** this line reverts the `todos` state back to the `originalTodos` array,
      ** effectively undoing the local UI change made earlier.
      ** This ensures that the UI remains consistent with the server state.
      */
      setTodos(originalTodos)
    })
  }


  //** update function
  const updateTodo = (e, id, text, todo) => {
    /**
    ** The updateTodo function is defined with four parameters:
    **    `e` (an event object),
    **    `id` (the ID of the todo to be updated),
    **    `text` (the updated task text for the todo), and
    **    `todo` (the todo object itself).
    ** The purpose of this function is to update a todo item with the provided information.
    */

    /**
    ** The `e.preventDefault()` call prevents the default behavior of an event,
    ** which is often used in form submissions to prevent the page from reloading.
    */
    e.preventDefault()

    /**
    ** creates a copy of the current `todos` array and stores it in the `originalTodos` constant.
    ** This copy is being kept in case the subsequent API call (HTTP PATCH request) fails and
    ** the application needs to revert the state changes.
    */
    const originalTodos = [...todos]

    /**
    ** This line helps to get the current todo based on the ID called todoId in TodoList.
    ** Creates a new object `updatedUser` by copying properties from the `todo` object and
    ** updating the `id`, `task`, and `completed` properties.
    */
    const updatedUser = { ...todo, id: id, task: text, completed: false };

    /**
    ** Updates the state of `todos` using the `setTodos` function.
    ** It maps through the existing `todos` array and replaces the item with
    ** the matching `id` with the `updatedUser` object.
    ** This effectively updates the todo item in the UI.
    */
    setTodos(todos.map(t => t.id == id ? updatedUser : t))

    /**
    ** Creates another updated version of the `todo` object with just the `task` property changed.
    */
    const updatedTodo = { ...todo, task:text}


    axios.patch('http://127.0.0.1:8000/todos/' + id, updatedTodo)
    .catch(err => {
      /**
      ** This sets up a catch block to handle errors that might occur during the API request.
      ** If the PATCH request encounters an error, the provided callback function will be executed.
      */
      setErrors(err.message)

      /**
      ** If an error occurs during the PATCH | UPDATE request,
      ** this line reverts the `todos` state back to the `originalTodos` array,
      ** effectively undoing the local UI change made earlier.
      ** This ensures that the UI remains consistent with the server state.
      */
      setTodos(originalTodos)
    })
  }

  const completeTodo = (e, id, todo) => {
    /**
    ** Here's a breakdown of the code:
    **
    ** 1.) The function `completeTodo` takes three parameters:
    ** `e` (an event object), `id` (the ID of the todo), and `todo` (the todo object itself).
    **
    ** 2.) The function starts with a conditional check using `e.target.checked` to determine
    ** whether the associated todo checkbox has been checked or unchecked.
    **
    ** 3.) If the checkbox is checked (meaning the user wants to mark the todo as completed),
    ** the code inside the first block is executed:
    **
    **    a.) The `setTodos` function is called with a modified array of todos using the `map` method.
    **        For the todo with the given `id`, its `completed` property is set to `true`,
    **        effectively marking it as completed.
    **        For other todos, their properties remain unchanged.
    **    b.) An `updatedTodo` object is created by copying the properties of the original todo and
    **        setting its completed property to true.
    **
    **    c.) An Axios PATCH request is made to update the todo on the server using the
    **        provided API URL and the `updatedTodo` data.
    **
    ** 4.) If the checkbox is not checked (meaning the user wants to mark the todo as not completed),
    **  the code inside the second block is executed:
    **
    **    a.) Similar to the previous block, the setTodos function is used to update the local state of todos,
    **        setting the completed property of the specified todo to false.
    **    a.) An updatedTodo object is created, again copying the original todo properties but 
    **        this time with completed set to false.
    **    c.) An Axios PATCH request is sent to update the todo on the server using the API URL and
    **        the updatedTodo data.
    */

    if(e.target.checked){
      console.log("complete")
      // setTodos(todos.map(todo => todo.id == id ? { ...todo, status:"Completed"}: todo))
      setTodos(todos.map(todo => todo.id == id ? { ...todo, completed:true}: todo))

      // const updatedTodo = { ...todo, task:text}
      const updatedTodo = { ...todo, completed:true}
      axios.patch('http://127.0.0.1:8000/todos/' + id, updatedTodo)
      // .catch(err => {
      //   setErrors(err.message)
      //   setTodos(originalTodos)
      // })
    }
    else
    {
      console.log("NOT complete")
      // setTodos(todos.map(todo => todo.id == id ? { ...todo, status:"Active"}: todo))
      setTodos(todos.map(todo => todo.id == id ? { ...todo, completed:false}: todo))

      const updatedTodo = { ...todo, completed:false}
      axios.patch('http://127.0.0.1:8000/todos/' + id, updatedTodo)
      // .catch(err => {
      //   setErrors(err.message)
      //   setTodos(originalTodos)
      // })
    }

  }

  const filterTodo = (cat_value) => {
    // setTodos(todos.filter(todo => todo.status == cat_value))
    setTodos(todos.filter((todo) => todo.status == cat_value))
  }


  return (
    <div className="todo-container">
      {errors && <p>{errors}</p>}
      <Search addTodo = { addTodo } />
      <Filter filter_todo = { filterTodo }/>
      <TodoList todos = { todos } delete_todo = { deleteTodo } update_todo = { updateTodo } complete_todo = { completeTodo } filter_todo = { filterTodo } />
    </div>
  );
}



export default App;
