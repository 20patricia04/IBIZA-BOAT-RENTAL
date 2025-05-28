import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Asigură-te că App.jsx există în același director src
import './index.css'; // Asigură-te că acest fișier există și este minimal (vezi Pasul 2)
import { BrowserRouter } from 'react-router-dom'; // Importă BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Îmbracă componenta App în BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
