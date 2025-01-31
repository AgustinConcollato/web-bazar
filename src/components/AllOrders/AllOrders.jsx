import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { Loading } from "../Loading/Loading";
import './AllOrders.css'

export function AllOrders({ orders }) {
    return (
        <div>
            {orders ?
                orders.length !== 0 ?
                    <div>
                        <h1>Mis pedidos</h1>
                        <ul>
                            {orders.map(order => (
                                <li key={order.id}>
                                    <Link to={order.id}>
                                        <p>{formatDate(order.date)}</p>
                                        <p>${order.total_amount}</p>
                                        <p>{order.status}</p>
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