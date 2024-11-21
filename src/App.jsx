import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './components/Auth/Login/Login'
import { AuthContext } from './context/authContext'
import { useContext } from 'react'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { Header } from './components/Header/Header'
import { Register } from './components/Auth/Register/Register'

export function App() {

  const { user } = useContext(AuthContext)

  function ProtectedLayout({ isUser }) {
    return (
      <ProtectedRoute isUser={isUser}>
        <Outlet />
      </ProtectedRoute>
    )
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path='/iniciar-sesion' element={<Login />} />
        <Route path='/registrarse' element={<Register />} />
        <Route path='/productos/:categoryCode' element={<></>} />
        <Route path='/buscador/:productName' element={<></>} />
        <Route path='/pedido' element={<></>} />
        <Route path='*' element={<>no se encontró</>} />
      </Routes>
    </>
  )
}

