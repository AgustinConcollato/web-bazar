import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { Addresses } from "../components/Addresses/Addresses"
import { AuthContext } from "../context/authContext"

export function ProfilePage() {

    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (user) {
            document.title = 'Tu perfil - ' + user.displayName
        }
    }, [user])


    if (!user) {

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
            <h1>Hola, {user.displayName}</h1>
            <Addresses user={user} type={'PROFILE'}/>
        </section >

    )
}