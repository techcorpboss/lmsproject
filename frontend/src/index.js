import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // import Provider
import { store } from './app/store';    // import store
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Kích hoạt Progressive Web App (PWA) & Service Worker
serviceWorkerRegistration.register();