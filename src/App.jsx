import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './components/Auth/Login/Login'
import { Register } from './components/Auth/Register/Register'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductPage } from './pages/ProductPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage/VerifyEmailPage'
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage/TermsAndConditionsPage'

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/iniciar-sesion' element={<Login />} />
        <Route path='/registrarse' element={<Register />} />
        <Route path='/verificar-correo' element={<VerifyEmailPage />} />
        <Route path='/productos/:categoryCode/*' element={<ProductPage />} />
        <Route path='/buscador/:productName' element={<SearchResultsPage />} />
        <Route path='/pedido/*' element={<ShoppingCartPage />} />
        <Route path='/producto/:productId' element={<ProductDetailPage />} />
        <Route path='/perfil' element={<ProfilePage />} />
        <Route path='/compras/*' element={<OrdersPage />} />
        <Route path='/terminos-condiciones' element={<TermsAndConditionsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  )
}

