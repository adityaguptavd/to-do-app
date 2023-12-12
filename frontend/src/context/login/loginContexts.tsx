// context api for all tasks uses
import { createContext } from "react";

interface defaultLoginContextType{
    logged : boolean,
    setLogged : React.Dispatch<React.SetStateAction<boolean>>
}

const defaultLoginContextValue : defaultLoginContextType = {
    logged : false,
    setLogged : ()=>{}
}

const loginContext = createContext<defaultLoginContextType>(defaultLoginContextValue);
export default loginContext;