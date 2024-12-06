import { initializeApp } from "firebase/app";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { AuthProvider } from './context/authContext.jsx';
import { CategoriesProvider } from "./context/CategoriesContext.jsx";

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_APP_MESSAGING_SENDER_ID
} = import.meta.env

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: "bazar-regalaria.firebaseapp.com",
  databaseURL: "https://bazar-regalaria-default-rtdb.firebaseio.com",
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: "bazar-regalaria.appspot.com",
  messagingSenderId: VITE_FIREBASE_APP_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID
};

initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CategoriesProvider>
        <App />
      </CategoriesProvider>
    </AuthProvider>
  </BrowserRouter>
)
