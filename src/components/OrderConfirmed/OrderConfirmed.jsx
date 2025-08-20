import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import './OrderConfirmed.css'

export function OrderConfirmed() {

    const { id } = useParams()

    useEffect(() => {
        localStorage.removeItem('address')
        scrollTo(0, 0)
    }, [])

    return (
        <section className="order-confirmed">
            <div className="order-confirmed-header">
                <h1>¡Pedido confirmado!</h1>
                <div className="icon">
                    <i className="hgi hgi-stroke hgi-checkmark-circle-01"></i>
                </div>
            </div>
            <p className="order-confirmed-text">
                Tu pedido ha sido confirmado y se encuentra en proceso de preparación.
            </p>
            <p className="order-confirmed-text">
                Nos comunicaremos a la brevedad para coordinar el envío o retiro del mismo.
            </p>
            <p className="order-confirmed-text">
                ¡Muchas gracias por tu compra!
            </p>
            <div className="container-btn">
                <Link to={'/compras/' + id} className="btn">Ver pedido actual</Link>
                <Link to={'/compras'} className="btn">Ver todos mis pedidos</Link>
                <Link to={'/'} className="btn">Volver al inicio</Link>
            </div>
        </section>
    )
}