import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../../context/CartContext"
import { url } from "../../services/api"
import { Addresses } from "../Addresses/Addresses"
import { Loading } from "../Loading/Loading"
import { Modal } from "../Modal/Modal"
import { PaymentOption } from "../PaymentOption/PaymentOption"
import './ConfirmOrder.css'

export function ConfirmOrder({ client }) {

    const { confirmCart, cart } = useContext(CartContext)

    const navigate = useNavigate()

    const [changeAddress, setChangeAddress] = useState(false)
    const [address, setAddress] = useState(null)
    const [comment, setComment] = useState(null)
    const [message, setMessage] = useState('')
    const [totalAmount, setTotalAmount] = useState(0)
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [allowTwoMethods, setAllowTwoMethods] = useState(false);
    const [send, setSend] = useState(false)
    const [loading, setLoading] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState(null)

    // Calcula el costo de envío
    const shippingCost =
        !send && address && address.city?.toLowerCase() === 'rafaela' && address.zip_code === '2300'
            ? (client.type == "reseller" ? 3500 : 2000)
            : 0;
    // Precio final (subtotal + envío)
    const hasCreditCard = paymentMethods && paymentMethods[0] === 'credit_card';
    const surcharge = hasCreditCard ? totalAmount * 0.1 : 0;
    const finalTotal = totalAmount + shippingCost + surcharge;

    async function confirm() {

        setMessage('');

        if (!address && !send) {
            setMessage('No hay un dirección seleccionada para el pedido')
            return
        }

        const selectedMethods = Object.keys(paymentAmounts);
        const totalPayments = Object.values(paymentAmounts).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

        if (allowTwoMethods) {
            if (selectedMethods.length !== 2) {
                setMessage('Seleccioná los métodos de pago faltantes');
                return;
            }
            const hasZero = selectedMethods.some(method => paymentAmounts[method] === 0);
            if (hasZero) {
                setMessage('Ambos métodos deben tener un monto a pagar');
                return;
            }
        } else {
            if (selectedMethods.length !== 1) {
                setMessage('Seleccioná un método de pago');
                return;
            }
        }

        if (Math.abs(totalPayments - totalAmount) > 0.01) {
            setMessage('La suma de los métodos de pago no coincide con el precio total del pedido');
            return;
        }


        const data = {
            client_id: client.id,
            user_name: client.name,
            comment,
            payment_methods: paymentAmounts,
            delivery: shippingCost,
            discount: 0
        }

        if (send) {
            data.address = {
                transport: true
            }
        } else {
            data.address = address
        }

        setLoading(true)

        try {
            const order_id = await confirmCart(data)

            navigate('/pedido/confirmado/' + order_id)
        } catch (error) {

            if (error.errors?.payment_methods[0] == "The payment methods field is required.") {
                setMessage('Seleccioná un método de pago');
                return
            }

            setMessage(error.error)
        } finally {
            setLoading(false)
        }
    }

    async function getAddress(userId) {
        const response = await fetch(`${url}/user/${userId}`)

        if (!response.ok) {
            setAddress([])
            return
        }

        const addresses = await response.json()

        // comprobar si la direccion de localstorage existe en el array de direcciones
        // si existe, que la direccion sea la de localstorage
        // si no existe, que se la que tenga el valor de status en 'selected'

        if (localStorage.getItem('address')) {
            const addressExists = addresses.some(addr => addr.id === JSON.parse(localStorage.getItem('address')).id);
            if (addressExists) {
                setAddress(JSON.parse(localStorage.getItem('address')))
                return
            } else {
                localStorage.removeItem('address')

            }
        }

        addresses.forEach(e => {
            e.status && setAddress(e)
        })

    }

    useEffect(() => {
        !address && getAddress(client.id)
        setChangeAddress(false)
    }, [address])

    useEffect(() => {
        address && getAddress(client.id)
    }, [])

    useEffect(() => {
        if (cart && cart.length > 0) {
            setTotalAmount(
                cart.reduce((acc, item) => {
                    let finalPrice = item.product.price;

                    // Priorizar descuento de campaña sobre descuento del producto
                    if (item.product.campaign_discount) {
                        if (item.product.campaign_discount.type === "percentage") {
                            finalPrice = item.product.price - (item.product.price * item.product.campaign_discount.value / 100);
                        } else {
                            // Descuento fijo
                            finalPrice = Math.max(0, item.product.price - item.product.campaign_discount.value);
                        }
                    } else if (item.product.discount) {
                        finalPrice = item.product.price - (item.product.price * item.product.discount / 100);
                    }

                    return acc + item.quantity * finalPrice;
                }, 0)
            )
        } else {
            navigate('/pedido')
        }

        scrollTo(0, 0)
    }, [cart])

    useEffect(() => {
        // Actualizar los métodos de pago disponibles
        if (Object.keys(paymentAmounts).length > 0) {
            setPaymentMethods(Object.keys(paymentAmounts));
        } else {
            setPaymentMethods(null);
        }
    }, [paymentAmounts])

    return (
        <section className="section-confirm-order">
            {cart ?
                <div className="confirm-order-info">
                    <div>
                        <h2>Confirmar pedido</h2>
                        <p>Por favor, confirma los datos de tu pedido</p>
                    </div>
                    <div className="order-delivery-options">
                        <h3>¿Cómo querés recibir tu pedido?</h3>

                        <div className="delivery-radio-group">
                            <div className="send-option">
                                <label>
                                    <input
                                        type="radio"
                                        name="deliveryOption"
                                        checked={!send}
                                        onChange={() => setSend(false)}
                                    />
                                    Enviar a domicilio
                                </label>
                                {!send &&
                                    <>
                                        <div>
                                            <p className="price-for-delivery">
                                                Dirección de envío
                                                <b>
                                                    {address ?
                                                        address.city?.toLowerCase() === 'rafaela' && address.zip_code === '2300'
                                                            ? `$${shippingCost}`
                                                            : 'A coordinar'
                                                        : ''
                                                    }
                                                </b>
                                            </p>
                                            <div className="address-for-order">
                                                {address ?
                                                    <>
                                                        <p className="order-address-selected">
                                                            {address.address + ' ' + address.address_number}
                                                            <button className="btn-change-address" onClick={() => setChangeAddress(!changeAddress)}>Cambiar</button>
                                                        </p>
                                                        <p>{address ? address.city + ', ' + address.province : ''}</p>
                                                    </> :
                                                    <>
                                                        <p>No hay direcciones registradas</p>
                                                        <button className="btn-change-address" onClick={() => setChangeAddress(!changeAddress)}>Agregar nueva dirección</button>
                                                    </>
                                                }
                                            </div>
                                            {changeAddress &&
                                                <Modal onClose={setChangeAddress}>
                                                    <Addresses client={client} type={'MODAL'} onChange={setAddress} />
                                                </Modal>
                                            }
                                        </div>
                                        {client.type == 'reseller' && <p><span>*</span>El costo del envío queda a cargo del cliente.</p>}
                                        <p><span>*</span>Nos comunicaremos a la brevedad para coordinar el transporte.</p>
                                    </>
                                }
                            </div>
                            <div className="send-option">
                                <label>
                                    <input
                                        type="radio"
                                        name="deliveryOption"
                                        checked={send}
                                        onChange={() => setSend(true)}
                                    />
                                    Retirar por depósito (Rafaela, Santa Fe)
                                </label>
                                {send &&
                                    <div>
                                        <p>Dirección de depósito</p>
                                        <div className="address-for-order">
                                            <p className="order-address-selected">
                                                Juan José Paso 1523
                                                <Link
                                                    to={'https://www.google.com.ar/maps/place/Juan+Jos%C3%A9+Paso+1523,+S2300+Rafaela,+Santa+Fe/@-31.2664114,-61.5118381,70m/data=!3m1!1e3!4m6!3m5!1s0x95caae2af4108a65:0xfd97a1b7bba70429!8m2!3d-31.2663358!4d-61.511836!16s%2Fg%2F11l75_ggfg?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D'}
                                                    target='_blank'
                                                    className="btn-change-address"
                                                >
                                                    Ver en Google Maps
                                                </Link>
                                            </p>
                                            <p>Rafaela, Santa Fe</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                    <div className="payment-methods">
                        <h3>Métodos de pago</h3>
                        <PaymentOption
                            totalAmount={totalAmount.toFixed(2)}
                            onChange={setPaymentAmounts}
                            allowTwoMethods={allowTwoMethods}
                            setAllowTwoMethods={setAllowTwoMethods}
                        />
                    </div>
                    <div className="order-comment">
                        <h3>Agregar comentario</h3>
                        <textarea
                            onChange={(e) => e.target.value.length <= 300 && setComment(e.target.value)}
                            placeholder="Agrega un comentario al pedido"
                            value={comment}
                        >
                        </textarea>
                        <span>{comment?.length || 0}/300</span>
                    </div>

                </div> :
                <Loading />
            }
            <div className="confirm-order">
                <h4>Detalle del pedido</h4>
                <div className="confirm-order-price">
                    <p>Subtotal <span>${totalAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span></p>
                    <p>Recargo
                        <span>
                            {paymentMethods &&
                                paymentMethods[0] === 'credit_card'
                                ? `10% / $${parseFloat(totalAmount * 0.1).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
                                : '$0'
                            }
                        </span>
                    </p>
                    <p>
                        Envio
                        <span>
                            {send
                                ? 'Retiro en depósito'
                                : address
                                    ? address.city?.toLowerCase() === 'rafaela' && address.zip_code === '2300'
                                        ? `$${shippingCost}`
                                        : 'A coordinar'
                                    : 'No seleccionado'
                            }
                        </span>
                    </p>
                    <p>
                        Precio total
                        <span>
                            {typeof totalAmount === 'number'
                                ? `$${finalTotal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
                                : '$0'
                            }
                        </span>
                    </p>
                </div>
                {message && <p className="message-error">{message} <FontAwesomeIcon icon={faXmark} onClick={() => setMessage('')} /></p>}
                <button onClick={confirm} className="btn btn-solid" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar pedido'}</button>
            </div>
        </section>
    )
}