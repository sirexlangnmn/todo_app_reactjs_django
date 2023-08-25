import React, { useState, useRef } from 'react';
import Filter from './Filter';
import { AiFillDelete } from 'react-icons/ai';
import { TbEdit } from 'react-icons/tb';
import { useForm } from 'react-hook-form';

const TodoList = ({
  todos,
  delete_todo,
  update_todo,
  complete_todo,
  filter_todo,
}) => {
  // this line references the update input field
  let taskRef = useRef(null);

  let [todoId, setTodoId] = useState(0);
  let [task, setTask] = useState('');

  let [toggle, setToggle] = useState(false);

  // this line helps to get the current value of the update field as the user types in.
  // let [todo, setTodo] = useState('');
  let [todo, setTodo] = useState({});

  // this function helps to pass the current todo to the updateform
  const todoItem = (task, id, todo) => {
    // this line helps to fill up the update input field with the current todo
    // taskRef.current.value = task

    // this line helps to get the current id of the todoitem

    setTodoId(id);
    setTask(task);
    setToggle(true);
    setTodo(todo)

    console.log(toggle);
  };

  return (
    <>
      <div className="todo-list">
        {/* {console.log('TodoList.jsx logs todos ', todos )} */}
        {/* {console.log('TodoList.jsx logs delete_todo ', delete_todo )} */}
        {/* {console.log('TodoList.jsx logs update_todo ', update_todo )} */}
        {/* {console.log('TodoList.jsx logs complete_todo ', complete_todo )} */}
        {todos.map((todo, index) => (
          <div className="todo-list-item" key={index}>
            <div className="task">
              <input
                type="checkbox"
                checked={todo.completed == true ? true : false}
                onChange={(e) => complete_todo(e, todo.id, todo)}
              />
              {/* <p id = "t_task">{todo.task}</p> */}
              <p
                id="t_task"
                // className={todo.status == 'Completed' ? 'strike' : ''}
                className={todo.completed == true ? 'strike' : ''}
              >
                {todo.task}
              </p>
            </div>
            <div className="btn-container">
              <div className="edit">
                {' '}
                <TbEdit
                  size={25}
                  onClick={(e) => todoItem(todo.task, todo.id, todo)}
                />{' '}
              </div>
              <div className="del">
                <AiFillDelete size={25} onClick={() => delete_todo(todo.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* modal section */}

      {toggle && (
        <div className="modal-container">
          <div className="modal">
            <h1>Update Form</h1>

            <form
              action=""
              onSubmit={(e) => {
                update_todo(e, todoId, task);
                setToggle(false);
              }}
            >
              <input
                type="text"
                ref={taskRef}
                placeholder="Update Todo"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
              />
              <button id="add">Add</button>
            </form>

            <div className="btn-container">
              <button
                className="cancel mod-btn"
                onClick={() => setToggle(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoList;
