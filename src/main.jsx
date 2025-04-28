import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { AuthProvider } from './context/authContext.jsx';
import { CartProvider } from "./context/CartContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
