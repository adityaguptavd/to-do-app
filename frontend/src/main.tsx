import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginState from './context/login/LoginState.tsx'
import App from './App.tsx'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoginState><App /></LoginState>
  </React.StrictMode>
)
