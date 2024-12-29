import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { SocketProvider } from './utils/SocketProvider.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <SocketProvider>

    <App />
    </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);

