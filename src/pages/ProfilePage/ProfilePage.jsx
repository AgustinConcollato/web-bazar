import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Addresses } from "../../components/Addresses/Addresses"
import { AuthContext } from "../../context/authContext"
import './ProfilePage.css'
import { Loading } from "../../components/Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

export function ProfilePage() {

    const { client, logOut, updatePhone } = useContext(AuthContext)

    const [updatePhoneNumber, setUpdatePhoneNumber] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

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

    useEffect(() => {
        if (client) {
            document.title = 'Tu perfil - ' + client.name
        }
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
                                {!loading ?
                                    <>
                                        <button className="btn btn-solid">Actualizar</button>
                                        <button className="btn" type="button" onClick={() => {
                                            setError('')
                                            setUpdatePhoneNumber(false)
                                        }} >Cancelar</button>
                                    </> :
                                    <Loading />
                                }
                            </form>
                        }
                        {error && <p className="message-error">{error} <FontAwesomeIcon icon={faXmark} onClick={() => setError('')} /> </p>}
                        {!updatePhoneNumber && <button className="btn" onClick={() => setUpdatePhoneNumber(true)}>{client.phone_number ? 'Actualizar número de teléfono' : 'Agregar número de teléfono'}</button>}
                    </div>
                </div>
                <Addresses client={client} type={'PROFILE'} />
            </div>
        </section>

    )
}