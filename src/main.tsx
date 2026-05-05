import React from 'react';
import ReactDOM from 'react-dom/client';
import { OperationsProvider } from './context/OperationsContext';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <OperationsProvider>
      <App />
    </OperationsProvider>
  </React.StrictMode>
);
