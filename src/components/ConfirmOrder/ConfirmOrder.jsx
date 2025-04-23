import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../../context/CartContext"
import { url } from "../../services/api"
import { Addresses } from "../Addresses/Addresses"
import { Loading } from "../Loading/Loading"
import { Modal } from "../Modal/Modal"
import { PaymentOption } from "../PaymentOption/PaymentOption"
import './ConfirmOrder.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

export function ConfirmOrder({ user }) {

    const { confirmCart, cart } = useContext(CartContext)

    const navigate = useNavigate()

    const [changeAddress, setChangeAddress] = useState(false)
    const [address, setAddress] = useState(localStorage.getItem('address') ? JSON.parse(localStorage.getItem('address')) : null)
    const [comment, setComment] = useState(null)
    const [message, setMessage] = useState('')
    const [totalAmount, setTotalAmount] = useState(0)
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [allowTwoMethods, setAllowTwoMethods] = useState(false);


    async function confirm() {

        setMessage('');

        if (!address) {
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
            client_id: user.uid,
            user_name: user.displayName,
            comment,
            address,
            payment_methods: paymentAmounts,
        }

        try {
            const order_id = await confirmCart(data)

            navigate('/pedido/confirmado/' + order_id)
        } catch (error) {
            console.log(error)
        }
    }

    async function getAddress(userId) {
        const response = await fetch(`${url}/user/${userId}`)

        if (!response.ok) {
            setAddress([])
            return
        }

        const addresses = await response.json()

        addresses.forEach(e => {
            e.status && setAddress(e)
        })

    }

    useEffect(() => {
        !address && getAddress(user.uid)
        setChangeAddress(false)
    }, [address])

    useEffect(() => {
        cart && cart.length != 0 &&
            setTotalAmount(
                cart.reduce((acc, item) => {
                    const price = item.product.discount ? item.product.price - (item.product.price * item.product.discount / 100) : item.product.price;
                    return acc + item.quantity * price;
                }, 0)
            )
    }, [cart])

    return (
        <section className="section-confirm-order">
            {cart ?
                <div className="confirm-order-info">
                    <div>
                        <h2>Confirmar pedido</h2>
                        <p>Por favor, confirma los datos de tu pedido</p>
                    </div>
                    <div className="confirm-order-address">
                        <h3>Dirección de envío</h3>
                        <div className="address-for-order">
                            {address ?
                                <>
                                    <p className="order-address-selected">
                                        {address.address + ' ' + address.address_number}
                                        <button className="btn-change-address" onClick={() => setChangeAddress(!changeAddress)}>Cambiar</button>
                                    </p>
                                    <p>{address ? address.city : ''}</p>
                                </> :
                                <>
                                    <p>No hay direcciones registradas</p>
                                    <button className="btn-change-address" onClick={() => setChangeAddress(!changeAddress)}>Agregar nueva dirección</button>
                                </>
                            }
                        </div>
                        {changeAddress &&
                            <Modal onClose={setChangeAddress}>
                                <Addresses user={user} type={'MODAL'} onChange={setAddress} />
                            </Modal>
                        }
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
                <div className="confirm-order-price">
                    <p>
                        Precio total: ${totalAmount}
                        <span>El precio no incluye el costo del envio</span>
                    </p>

                </div>
                {message && <p className="message-error">{message} <FontAwesomeIcon icon={faXmark} onClick={() => setMessage('')} /></p>}
                <button onClick={confirm} className="btn btn-solid">Confirmar pedido</button>
                <div className="accept-terms-conditions">
                    <p>Al confirmar el pedido estás aceptando los <Link to={'/terminos-condiciones-compra'}>términos y condiciones</Link> de compra.</p>
                </div>
            </div>
        </section>
    )
}