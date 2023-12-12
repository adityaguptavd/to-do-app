import Heading from "./Heading";
import Task from "./Task";
import { FormEvent, useContext, CSSProperties, useState } from "react";
import tasksContext from "../context/tasks/tasksContext";
import ErrorIcon from '@mui/icons-material/Error';
import { ClipLoader } from "react-spinners";

// CSS property to override the default css of react-spinner
const override: CSSProperties = {
    display: "inline-block",
    marginLeft: "auto",
    marginRight: "5px",
    height : "50px",
    width : "50px",
    borderWidth : "4px"
};

// For hiding alert
export const hideAlert = (): void => {
    const alertContent = document.getElementById('alert-content')!
    const alert = document.getElementById('alert')!
    alert.style.opacity = "0";
    alertContent.innerText = '';
}

// For showing alerts
export const alert = (mssg: string): void => {
    const alertContent = document.getElementById('alert-content')!
    const alert = document.getElementById('alert')!
    alert.style.opacity = "1";
    alertContent.innerText = mssg;
    setTimeout(() => {
        hideAlert();
    }, 3000);
}

export default function ToDoList() {

    // state variable for loader
    const [isLoading, setLoading] = useState(false);

    // import necessary items from tasksContext
    const { addTask } = useContext(tasksContext);

    // handle the submit event of form
    async function submit(event: FormEvent) {
        event.preventDefault();
        const newTask: string = (document.getElementById('newItem') as HTMLInputElement).value;
        // render the loader
        setLoading(true);
        if (await addTask(newTask))
            (document.getElementById('newItem') as HTMLInputElement).value = '';
        // render the button
        setLoading(false);
    }

    return (
        <>
            <Heading title={localStorage.getItem('username')!} />
            <div className="box">
                <form method="post" action="/addtask" onSubmit={submit} className="form">
                    <input type="text" name="newItem" placeholder="New Task" autoComplete="off" id="newItem" />
                    {isLoading ? <ClipLoader
                        color='#A683E3'
                        loading={true}
                        cssOverride={override}
                    /> : <button type="submit" id="addTaskBtn">+</button>}
                </form>
                <div id="alert"><ErrorIcon sx={{ fontSize: "16px" }} /><span id="alert-content"></span></div>
                <Task />
            </div>
        </>
    )
}
