import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import './OrderDetails.css';

export function OrderDetails({ order, address }) {
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
            {
                address.transport ?
                    <ul>
                        <li>Retirar
                            <Link
                                to={'https://www.google.com.ar/maps/place/Juan+Jos%C3%A9+Paso+1523,+S2300+Rafaela,+Santa+Fe/@-31.2664114,-61.5118381,70m/data=!3m1!1e3!4m6!3m5!1s0x95caae2af4108a65:0xfd97a1b7bba70429!8m2!3d-31.2663358!4d-61.511836!16s%2Fg%2F11l75_ggfg?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D'}
                                target='_blank'
                            >
                                <p>
                                    <b>Juan José Paso 1523</b>
                                    <span>Rafaela, Santa fe</span>
                                </p>
                            </Link>
                        </li>
                    </ul> :
                    < ul >
                        <li>Enviar
                            <p>
                                <b>{address.address} {address.address_number}</b>
                                <span>{address.city}, {address.province}</span>
                            </p>
                        </li>
                    </ul>
            }
            <ul>
                <li>Métodos de pago
                    <p>
                        {order.payments.map(e =>
                            <p className='method'>
                                <b>${parseFloat(e.expected_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
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
                                ${parseFloat(order.total_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                            </span>
                            <b>${parseFloat(order.total_amount - (order.total_amount * order.discount) / 100).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
                        </p>
                    </li> :
                    <li>Precio<b>${parseFloat(order.total_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b></li>
                }
            </ul>
        </div >
    )
}