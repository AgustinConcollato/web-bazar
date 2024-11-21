import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/authContext'
import { AuthProviderButtons } from '../AuthProviderButtons'
import './Login.css'

export function Login() {

    const { user, login } = useContext(AuthContext)
    const navigate = useNavigate()

    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function validateForm(e) {
        e.preventDefault()
        console.log(email, password)
        if (email !== '' && password !== '') {
            const dataLogin = { email, password }
            login(dataLogin, setError)
        } else {
            setError('Completa todos los campos')
        }
    }

    useEffect(() => {
        user !== null && navigate('/')
    }, [user])

    return (
        <section className='login'>
            <p>Ingresar con correo electrónco</p>
            <form onSubmit={validateForm}>
                <input type="email" onChange={({ target }) => setEmail(target.value)} className='input' placeholder='Correo electrónico' />
                <input type="password" onChange={({ target }) => setPassword(target.value)} className='input' placeholder='Contraseña' />
                <button type="submit" className='btn btn-solid'>Ingresar</button>
            </form>
            {error && <p className='message-error'> {error} </p>}
            <div className="div"></div>
            <p>Ingresar con</p>
            <AuthProviderButtons setError={setError} />
            <div>
                <Link to={'/registrarse'} className='btn btn-auth' >Crear cuenta</Link>
            </div>
        </section>
    )
}