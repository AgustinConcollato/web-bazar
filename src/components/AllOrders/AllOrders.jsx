import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { Loading } from "../Loading/Loading";
import './AllOrders.css';
import { Pagination } from "../Pagination/Pagination";
import { api } from "../../services/api";

export function AllOrders({ client }) {

    const { Order } = api
    const order = new Order()

    const [orders, setOrders] = useState(null)
    const [page, setPage] = useState(1)

    async function getOrders() {
        const response = await order.get({ page })
        setOrders(response)
    }

    useEffect(() => {
        if (client) {
            getOrders()
        }
    }, [client, page])

    useEffect(() => {
        document.title = 'Tus pedidos'
        scrollTo(0, 0)
    }, [])

    return (
        <div>
            {orders ?
                orders.data.length !== 0 ?
                    <>
                        <div>
                            <h1>Mis pedidos</h1>
                            <ul className="orders-list">
                                {orders.data.map(order => (
                                    <li key={order.id}>
                                        <Link to={order.id}>
                                            <div>
                                                <p>{formatDate(order.updated_at)}</p>
                                                {order.status === "completed" ?
                                                    <p className="status-completed">Completado</p> :
                                                    order.status === "pending" ?
                                                        <p className="status-pending">Pendiente</p> :
                                                        order.status === "accepted" ?
                                                            <p className="status-preparation">En preparación</p> :
                                                            order.status === "rejected" ?
                                                                <p className="status-rejected">Rechazado</p> :
                                                                <p className="status-cancelled">Cancelado</p>
                                                }
                                            </div>
                                            <p>{order.discount ?
                                                <>
                                                    <p className="discount">
                                                        <span>-{order.discount}%</span>
                                                        <p className="price">${parseFloat(order.total_amount)}</p>
                                                    </p>
                                                    <p>${parseFloat(order.total_amount - (order.discount * order.total_amount) / 100)}</p>
                                                </> :
                                                <p>${parseFloat(order.total_amount)}</p>
                                            }</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Pagination
                            lastPage={orders?.last_page}
                            currentPage={orders?.current_page}
                            onPageChange={setPage}
                        />
                    </> :
                    <div>
                        <p className="not-orders">Todavía no has realizado ningún pedido</p>
                        <Link to='/' className="btn btn-solid">Volver al inicio</Link>
                    </div> :
                <Loading />
            }
        </div>
    )
}