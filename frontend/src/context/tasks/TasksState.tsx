import { useState, ReactNode } from "react";
import tasksContext, { ITask } from "./tasksContext";
import axios from "axios";
import { alert } from "../../components/ToDoList";

// propstype for tasksState
interface TasksStateProps {
  children: ReactNode;
}

export default function TasksState({ children }: TasksStateProps) {

  // API URL
  const url = 'http://localhost:5000';

  // initializing state for tasks
  const [tasks, setTasks] = useState<ITask[]>([]);

  // Fetch all tasks
  const fetchAllTasks = async (): Promise<boolean> => {
    try {
      const token: string | null = localStorage.getItem('auth-token');

      // Header for all requests
      const headers = {
        'Content-Type': 'application/json',
        'auth-token': token
      }
      // make fetch request to the server
      const response = await axios.get(`${url}/api/task/fetchalltasks`, { headers });
      if (response.status === 200) {
        // set the tasks state variable for initial rendering of the tasks
        setTasks(response.data.tasks);
        return true;
      }
      else {
        alert("Couldn't fetch tasks. Please try later.");
        return false;
      }
    }
    catch {
      alert("Couldn't fetch tasks. Please try later.");
      return false;
    }
  }

  // Add task
  const addTask = async (newTask: string): Promise<boolean> => {
    if(newTask.length < 3){
      alert("Task must be at least 3 characters long");
      return false;
    }
    try {
      const token: string | null = localStorage.getItem('auth-token');
      
      // Header for all requests
      const headers = {
        'Content-Type': 'application/json',
        'auth-token': token
      }
      const data = {
        task: newTask
      }
      
      // Add the task in database
      const response = await axios.post(`${url}/api/task/addtask`, data, { headers });
      if (response.status === 200) {
        const task: ITask = response.data.savedTask;
        // update the tasks state variable
        setTasks(prevTasks => [task, ...prevTasks]);
        return true;
      }
      else {
        alert("Something went wrong");
        return false;
      }
    }
    catch {
      alert("Something went wrong");
      return false;
    }
  }

  // Update task
  const updateTask = async (newTask: string, id: string): Promise<boolean> => {
    if(newTask.length < 3){
      alert("Task must be at least 3 characters long");
      return false;
    }
    // Update the relevant task in database
    try {
      const token: string | null = localStorage.getItem('auth-token');

      // Header for all requests
      const headers = {
        'Content-Type': 'application/json',
        'auth-token': token
      }
      const data = {
        task: newTask
      }
      const response = await axios.put(`${url}/api/task/updatetask/${id}`, data, { headers });
      if (response.status === 200) {
        const updatedTask: ITask = response.data.updatedTask;
        // Iterate the tasks to find and update by id on client side
        const updatedTasks: ITask[] = tasks;
        for (let i = 0; i < updatedTasks.length; i++) {
          if (updatedTasks[i]._id === id) {
            updatedTasks[i] = updatedTask;
            break;
          }
        }
        // update the tasks variable for rendering the updated tasks
        setTasks(updatedTasks);
        return true;
      }
      else {
        alert("Something went wrong.");
        return false;
      }
    }
    catch {
      alert("Something went wrong.");
      return false;
    }
  }

  // Delete task
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      // get the authentication token from local storage
      const token: string | null = localStorage.getItem('auth-token');

      // Header for all requests
      const headers = {
        'Content-Type': 'application/json',
        'auth-token': token
      }
    // Delete the task in database
      const response = await axios.delete(`${url}/api/task/deletetask/${id}`, { headers });
      if (response.status === 200) {
        const newTasks: ITask[] = tasks.filter((task: ITask) => {
          return task._id !== id
        });
        // update the tasks state variable for client side changes
        setTasks(newTasks);
        return true;
      }
      else {
        alert("Something went wrong.");
        return false;
      }
    }
    catch {
      alert("Something went wrong.");
      return false;
    }

  }

  return (
    <tasksContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask, fetchAllTasks }}>
      {children}
    </tasksContext.Provider>
  )
}
