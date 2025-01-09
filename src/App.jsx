import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './components/Auth/Login/Login'
import { Register } from './components/Auth/Register/Register'
import { Header } from './components/Header/Header'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductPage } from './pages/ProductPage'
import { ProfilePage } from './pages/ProfilePage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'

export function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/iniciar-sesion' element={<Login />} />
        <Route path='/registrarse' element={<Register />} />
        <Route path='/productos/:categoryCode/*' element={<ProductPage />} />
        <Route path='/buscador/:productName' element={<></>} />
        <Route path='/pedido/*' element={<ShoppingCartPage />} />
        <Route path='/producto/:productId' element={<ProductDetailPage />} />
        <Route path='/perfil' element={<ProfilePage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

