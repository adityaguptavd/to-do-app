import Heading from "./Heading"
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import axios from "axios";
import { useContext, FormEvent, CSSProperties, useState } from "react";
import loginContext from "../context/login/loginContexts";
import ErrorIcon from '@mui/icons-material/Error';
import { alert } from "./ToDoList";
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

export default function Login() {
    const url = 'http://localhost:5000';
    const {setLogged} = useContext(loginContext);

    // state variable for rendering  loader
    const [loader, setLoader] = useState(false)

    async function submit(event: FormEvent) {
        event.preventDefault();
        const name = (document.getElementById('name') as HTMLInputElement).value;
        if(name.length < 3){
            alert("Name must be 3 characters long");
            return;
        }

        const data: { name: string } = {name}
        try {
            // Render the loader instead of next button
            setLoader(true);
            // Get the auth token from server
            const headers = {
                'Content-Type': 'application/json'
            }
            const response = await axios.post(`${url}/api/auth/login`, data, { headers });
            if (response.status === 200) {
                const token = response.data.authToken;
                // save the name and authToken in localstorage received from server
                localStorage.setItem('auth-token', token);
                localStorage.setItem('username', name);
                setLogged(true);
            }
            else {
                alert("Something went wrong");
            }
            // Remove the loader and render the next button
            setLoader(false);
        }
        catch {
            alert("Something went wrong");
            // Remove the loader and render the next button
            setLoader(false);
            return;
        }
    }

    return (<>
        <Heading title={"What Should We Call You?"} />
        <div className="box" style={{minHeight : "100px"}}>
            <form method="post" action="/register" onSubmit={submit} style={{marginTop : "5px"}} className="form">
                <input type="text" name="name" placeholder="Your Name" autoComplete="off" id="name" />
                {loader ? <ClipLoader
                        color='#A683E3'
                        loading={true}
                        cssOverride={override}
                    /> : <button type="submit"><NavigateNextOutlinedIcon /></button>}
            </form>
            <div id="alert"><ErrorIcon sx={{fontSize : "16px"}} /><span id="alert-content"></span></div>
        </div>
    </>
    )
}
