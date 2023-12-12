// context api for all tasks uses
import { createContext } from "react";

// structure of the task content
export interface ITask{
    _id : string,
    user : string,
    task : string,
    date : string
}

// structure of taskContext's parameters
interface tasksContextType{
    tasks : ITask[],
    setTasks : React.Dispatch<React.SetStateAction<ITask[]>>
    addTask(newTask : string): Promise<boolean>;
    updateTask(newTask: string, id: string): Promise<boolean>;
    deleteTask(id : string): Promise<boolean>;
    fetchAllTasks() : Promise<boolean>;
}

const defaultTaskContextValue = {
    tasks : [],
    setTasks : async ()=>false,
    addTask: async ()=>false,
    updateTask: async ()=>false,
    deleteTask: async ()=>false,
    fetchAllTasks: async ()=>false
}

const tasksContext = createContext<tasksContextType>(defaultTaskContextValue);
export default tasksContext;