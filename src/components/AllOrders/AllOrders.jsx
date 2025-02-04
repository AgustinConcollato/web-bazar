import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { Loading } from "../Loading/Loading";
import './AllOrders.css'
import { useEffect } from "react";

export function AllOrders({ orders }) {

    useEffect(() => {
        document.title = 'Tus pedidos'
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
                                    {console.log(order)}
                                    <Link to={order.id}>
                                        <p>{formatDate(order.date)}</p>
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