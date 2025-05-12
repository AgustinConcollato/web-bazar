import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Addresses } from "../../components/Addresses/Addresses"
import { Loading } from "../../components/Loading/Loading"
import { AuthContext } from "../../context/authContext"
import { Auth } from "../../services/authService"
import './ProfilePage.css'

export function ProfilePage() {

    const { client, logOut, updatePhone } = useContext(AuthContext)

    const [updatePhoneNumber, setUpdatePhoneNumber] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [error, setError] = useState(false)
    const [errorEmail, setErrorEmail] = useState(false)
    const [updateEmail, setUpdateEmail] = useState(false)

    async function handlePhoneNumberChange(e) {
        e.preventDefault()

        const phone = { phone_number: e.target.phone_number.value }

        // comprobar si el nuevo número de teléfono es igual al actual
        if (phone.phone_number == client.phone_number) {
            setError('El número de teléfono es el mismo que el actual')
            return
        }

        try {
            setLoading(true)
            setError(false)
            const response = await updatePhone(phone)
            if (response) {
                setUpdatePhoneNumber(false)
            }
        } catch (error) {
            if (error.errors.phone_number[0] == 'The phone number field is required.') {
                setError('El número de teléfono es obligatorio')
            }
        } finally {

            setLoading(false)
        }
    }

    async function handleEmailChange(e) {
        e.preventDefault()

        const email = { email: e.target.email.value }

        // comprobar si el nuevo correo electrónico es igual al actual
        if (email.email == client.email) {
            setErrorEmail('El correo electrónico es el mismo que el actual')
            return
        }


        setErrorEmail('')
        const auth = new Auth()

        try {
            setLoadingEmail(true)
            const response = await auth.updateEmail(email)
            if (response) {
                setUpdateEmail(false)
                client.email = response.email
                client.email_verified_at = response.email_verified_at
            }
        } catch (error) {
            if (error.errors.email[0] == 'The email has already been taken.') {
                setErrorEmail('El correo electrónico ya está en uso')
            }

            if (error.errors.email[0] == "The email field is required.") {
                setErrorEmail('Completa con el correo electrónico')
            }
        } finally {
            setLoadingEmail(false)
        }
    }

    useEffect(() => {
        if (client) {
            document.title = 'Tu perfil - ' + client.name
        }
        scrollTo(0, 0)
    }, [client])


    if (!client) {

        document.title = 'Iniciar sesión para ver tu perfil'

        return (
            <section className="shopping-cart-page">
                <div className="shopping-cart-not-user">
                    <p>Ingresa a tu cuenta para ver tu perfil</p>
                    <Link to={'/iniciar-sesion'} className="btn btn-regular">Ingresar</Link>
                </div>
            </section>
        )
    }

    return (
        <section className="section-profile">
            <aside>
                <div>
                    <h3>{client.name}</h3>
                    <p>{client.email}</p>
                </div>
                <nav>
                    <Link to={'/compras'}>Mis pedidos</Link>
                    <Link to={'#'} onClick={logOut}>Cerrar sesión</Link>
                </nav>
            </aside>
            <div className="client-data">
                <h2>Mis datos</h2>
                <div>
                    <h4>Correo electrónico</h4>
                    <div className="verified-email">
                        <div>
                            <b>{client.email}</b>
                            {client.email_verified_at ?
                                <span className="status-completed">Verificado</span> :
                                <span className="status-rejected">No está verificado</span>
                            }
                        </div>
                        {!client.email_verified_at &&
                            <>
                                <p>Para tu seguridad y la de nuestra, verificar tu correo nos ayuda a confirmar que eres una persona real y no una cuenta falsa</p>
                                <div>
                                    <Link to={'/verificar-correo'} className="btn">Verificar</Link>
                                </div>
                            </>
                        }
                        {updateEmail &&
                            <form onSubmit={handleEmailChange} className="update-email">
                                <input type="email" className="input" name="email" placeholder="Correo electrónico" />
                                <div>
                                    <button className="btn" type="button" onClick={() => setUpdateEmail(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-solid" disabled={loadingEmail}>{loadingEmail ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Actualizar'}</button>
                                </div>
                                {errorEmail && <p className="message-error">{errorEmail} <FontAwesomeIcon icon={faXmark} onClick={() => setErrorEmail('')} /> </p>}

                            </form>
                        }
                        {!updateEmail && <button className="btn" onClick={() => setUpdateEmail(true)}>Actualizar correo electrónico</button>}
                    </div>
                </div>
                <div>
                    <h4>Número teléfono</h4>
                    <div className="phone-number">
                        {client.phone_number ?
                            <p>{client.phone_number}</p> :
                            <p>No hay número de teléfono registrado</p>
                        }
                        {updatePhoneNumber &&
                            <form onSubmit={handlePhoneNumberChange}>
                                <input
                                    name="phone_number"
                                    type="text"
                                    placeholder="Número de teléfono"
                                    className="input"
                                    autoComplete="off"
                                />
                                <button className="btn" type="button" onClick={() => {
                                    setError('')
                                    setUpdatePhoneNumber(false)
                                }} >Cancelar</button>
                                <button className="btn btn-solid" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Actualizar'}</button>
                            </form>
                        }
                        {error && <p className="message-error">{error} <FontAwesomeIcon icon={faXmark} onClick={() => setError('')} /> </p>}
                        {!updatePhoneNumber && <button className="btn" onClick={() => setUpdatePhoneNumber(true)}>{client.phone_number ? 'Actualizar número de teléfono' : 'Agregar número de teléfono'}</button>}
                    </div>
                </div>
                <Addresses client={client} type={'PROFILE'} onChange={() => { }} />
            </div>
        </section>

    )
}