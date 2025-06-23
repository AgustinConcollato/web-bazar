import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './components/Auth/Login/Login'
import { Register } from './components/Auth/Register/Register'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { ProductList } from './components/ProductList/ProductList'
import { CampaignPage } from './pages/CampaignPage/CampaignPage'
import { HomePage } from './pages/HomePage/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductPage } from './pages/ProductPage/ProductPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage/TermsAndConditionsPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage/VerifyEmailPage'

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/iniciar-sesion' element={<Login />} />
        <Route path='/registrarse' element={<Register />} />
        <Route path='/verificar-correo' element={<VerifyEmailPage />} />
        <Route path='/productos/:categoryCode/:subcategoryCode?' element={<ProductList />} />
        <Route path='/e/productos/:slug' element={<CampaignPage />} />
        <Route path='/buscador/:productName' element={<SearchResultsPage />} />
        <Route path='/pedido/*' element={<ShoppingCartPage />} />
        <Route path='/producto/:productId' element={<ProductPage />} />
        <Route path='/perfil' element={<ProfilePage />} />
        <Route path='/compras/*' element={<OrdersPage />} />
        <Route path='/terminos-condiciones' element={<TermsAndConditionsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  )
}