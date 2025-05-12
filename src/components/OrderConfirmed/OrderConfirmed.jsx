import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Order } from "../../services/ordersService"
import { Loading } from "../Loading/Loading"
import { OrderDetails } from "../OrderDetails/OrderDetails"
import './OrderConfirmed.css'

export function OrderConfirmed() {

    const orders = new Order()
    const { id } = useParams()

    const [order, setOrder] = useState(null)
    const [address, setAddress] = useState(null)

    async function getOrder() {
        try {
            const data = await orders.detail(id)

            setAddress(JSON.parse(data.address))
            setOrder(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        localStorage.removeItem('address')
        getOrder()
        scrollTo(0, 0)
    }, [])

    return (
        <section className="order-confirmed">
            <h1>¡Pedido confirmado!</h1>
            {order ?
                <OrderDetails order={order} address={address} /> :
                <Loading />
            }
            <div className="container-btn">
                <Link to={'/compras/' + id} className="btn">Ver pedido actual</Link>
                <Link to={'/compras'} className="btn">Ver todos mis pedidos</Link>
                <Link to={'/'} className="btn">Volver al inicio</Link>
            </div>
        </section>
    )
}