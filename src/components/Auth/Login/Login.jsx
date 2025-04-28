import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/authContext'
import './Login.css'
import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Login() {

    const { client, login } = useContext(AuthContext)
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    async function loginClient(e) {
        e.preventDefault()

        setLoading(true)
        const data = new FormData(e.target)

        try {
            const { client } = await login(data)
            if (client) {
                setLoading(false)
            }
        } catch (error) {
            if (error.errors) {
                if (error.errors.email && error.errors.password) {
                    setErrorMessage('Completa los campos con el correo electrónico y contraseña');
                } else if (error.errors.password) {
                    setErrorMessage('Completa con la contraseña');
                } else if (error.errors.email) {
                    setErrorMessage('Completa con el correo electrónico');
                } else if (error.errors.invalid) {
                    setErrorMessage(error.errors.invalid);
                }
            } else if (error.error) {
                setErrorMessage("El correo o la contraseña son incorrectos");
            } else {
                setErrorMessage("Ocurrió un error al iniciar sesión");
            }

            setLoading(false)
        }
    }

    function onHandleInput() {
        setErrorMessage(null)
    }

    useEffect(() => {
        client !== null && navigate('/')
        document.title = 'Ingresar a tu cuenta'
    }, [client])

    return (
        <section className='login'>
            <h3>Ingresar a la cuenta</h3>
            <form onSubmit={loginClient}>
                <input
                    className='input'
                    type="email"
                    onChange={onHandleInput}
                    name="email"
                    placeholder="Correo electrónico"
                    autoComplete='off'
                />
                <div>
                    <input
                        className='input'
                        type={passwordVisibility ? "text" : "password"}
                        onChange={onHandleInput}
                        name="password"
                        placeholder="Contraseña"
                        autoComplete='off'
                    />
                    <label><input type="checkbox" onChange={() => setPasswordVisibility(!passwordVisibility)} /> Mostrar constraseña </label>
                </div>
                <button type="submit" className='btn btn-solid' disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Ingresar'}</button>
            </form>
            {errorMessage && <p className="message-error">{errorMessage} <FontAwesomeIcon icon={faXmark} onClick={() => setErrorMessage(null)} /></p>}
            <div className="div"></div>
            <div>
                <Link to={'/registrarse'} className='btn btn-auth' >Crear cuenta</Link>
            </div>
        </section>
    )
}