import { formatDate } from '../../utils/formatDate';
import './OrderDetails.css';

export function OrderDetails({ order, address }) {

    console.log(address)

    return (
        <div className="order-details">
            <div>
                <h2>Resumen del pedido</h2>
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
            <ul>
                <li>Código<b>{order.id}</b></li>
                <li>Fecha<b>{formatDate(order.created_at)}</b></li>
            </ul>
            <ul>
                <li>Enviar
                    <p>
                        <b>{address.address} {address.address_number}</b>
                        <span>{address.city}, {address.province}</span>
                    </p>
                </li>
            </ul>
            <ul>
                <li>Métodos de pago
                    <p>
                        {order.payments.map(e =>
                            <p className='method'>
                                <b>${e.expected_amount}</b>
                                {e.method == 'transfer' ? 'Transferencia' : e.method == 'cash' ? 'Efectivo' : 'Cheque'}
                            </p>
                        )}
                    </p>
                </li>
            </ul>
            <ul>
                <li>Cantidad de productos <b>{order.products.length}</b></li>
                <li>Cantidad de unidades
                    <b>
                        {order.products.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.quantity,
                            0,
                        )}
                    </b>
                </li>
                {order.discount ? <li>Descuento <b>{order.discount}%</b></li> : null}
                {order.discount ?
                    <li>Precio
                        <p>
                            <span className="discount">
                                ${order.total_amount}
                            </span>
                            <b>${parseFloat(order.total_amount - (order.total_amount * order.discount) / 100)}</b>
                        </p>
                    </li> :
                    <li>Precio<b>${parseFloat(order.total_amount)}</b></li>
                }
            </ul>
        </div>
    )
}