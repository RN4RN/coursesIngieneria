import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ¿Está importando desde './App.jsx'?
import './index.css';     // ¿Estás importando el CSS de Tailwind?

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)