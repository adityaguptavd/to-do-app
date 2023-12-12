import Login from "./components/Login";
import ToDoList from "./components/ToDoList"
import TasksState from "./context/tasks/TasksState";
import { useContext } from "react";
import loginContext from "./context/login/loginContexts";

function App() {
  const {logged} = useContext(loginContext);
  return (
    <>
      {logged ? <TasksState><ToDoList /></TasksState> : <Login />}
    </>
  )
}

export default App;