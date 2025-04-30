import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { Loading } from "../Loading/Loading";
import './AllOrders.css';

export function AllOrders({ orders }) {

    useEffect(() => {
        document.title = 'Tus pedidos'
        scrollTo(0, 0)
    }, [])

    return (
        <div>
            {orders ?
                orders.length !== 0 ?
                    <div>
                        <h1>Mis pedidos</h1>
                        <ul className="orders-list">
                            {orders.map(order => (
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
                    </div> :
                    <div>
                        <p className="not-orders">Todavía no has realizado ningún pedido</p>
                        <Link to='/' className="btn btn-solid">Volver al inicio</Link>
                    </div> :
                <Loading />
            }
        </div>
    )
}