import { useContext, useState, useEffect, CSSProperties } from "react";
import tasksContext, { ITask } from "../context/tasks/tasksContext";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import loginContext from "../context/login/loginContexts";
import { ClipLoader } from "react-spinners";

// CSS property to override the default css of react-spinner used in place of edit icon
const overrideUpdate: CSSProperties = {
    display: "inline-block",
    marginLeft: "auto",
    marginRight: "4px",
    borderWidth : "3px",
    height : "19px",
    width : "19px"
};

// CSS property to override the default css of react-spinner used in place of delete icon
const overrideDelete: CSSProperties = {
    display: "inline-block",
    marginRight: "4px",
    borderWidth : "3px",
    height : "19px",
    width : "19px"
};

export default function Task() {

    // state variable for rendering react-spinner
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const { logged } = useContext(loginContext);

    // import all necessary state variables and functions from tasksContext
    const context = useContext(tasksContext);
    const { tasks, deleteTask, updateTask, fetchAllTasks } = context;

    // to check whether the user trying to edit the task or not
    const [editable, setEditable] = useState<string | null>(null);

    // set the input value if user is editing after being rendered
    useEffect(() => {
        if (editable !== null) {
            const task = tasks.find(task => task._id === editable);
            if (task) {
                (document.getElementById(editable) as HTMLInputElement).value = task.task;
            }
        }
    }, [editable]);

    // fetch all tasks after the user is logged
    useEffect(() => {
        if (logged) {
            fetchAllTasks();
        }
    }, []);

    // function to manage all the actions for tasks
    function manageTasks(task: ITask) {
        // update the task
        async function done(): Promise<void> {
            const newTask: string = (document.getElementById(task._id) as HTMLInputElement).value
            // render the update loader
            setUpdating(true);
            if (newTask !== task.task)
                await updateTask(newTask, task._id);
            setEditable(null);
            // render the edit icon
            setUpdating(false);
        }

        // allow user to edit the task
        function edit(): void {
            setEditable(task._id);
        }

        // Formating date and time of the task in (DD-MM-YYYY : Hrs:Min:Sec) format
        function datetime(): string {
            const [date, timestamp] = task.date.split('T');
            const [time] = timestamp.split('.');
            return `(${date} : ${time})`;
        }

        return (
            <div className="item" key={task._id}>
                <input type="checkbox" />
                {editable === task._id ? <input type="text" name="editedItem" placeholder={task.task} autoComplete="off" id={`${task._id}`} /> : <><p>{task.task}</p><span className="date">{datetime()}</span></>}

                {updating ? <ClipLoader
                        color='#A683E3'
                        loading={true}
                        cssOverride={overrideUpdate}
                    /> : (editable === task._id ? <DoneOutlinedIcon className="edit-icon" onClick={done} /> : <ModeEditOutlineOutlinedIcon className="edit-icon" onClick={edit} />)}

                {deleting ? <ClipLoader
                        color='#A683E3'
                        loading={true}
                        cssOverride={overrideDelete}
                    /> : <DeleteOutlineOutlinedIcon className="del-icon" onClick={async () => { 
                            setDeleting(true);
                            await deleteTask(task._id)
                            setDeleting(false);
                        }} />}
            </div>
        )
    }

    return (
        <>
            {tasks && tasks.map((task: ITask) => manageTasks(task))}
        </>
    )
}
