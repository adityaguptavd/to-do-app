import { useState, ReactNode } from "react";
import loginContext from "./loginContexts";

// propstype for tasksState
interface LoginStateProps {
  children: ReactNode;
}

export default function LoginState({ children }: LoginStateProps) {
    const isLogged = (localStorage.getItem('auth-token') ? true : false)
    const [logged, setLogged] = useState<boolean>(isLogged);
  return (
    <loginContext.Provider value={{logged, setLogged}}>
      {children}
    </loginContext.Provider>
  )
}
