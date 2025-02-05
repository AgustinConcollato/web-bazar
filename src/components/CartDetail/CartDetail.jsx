import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { url } from "api-services";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { CartContext } from "../../context/CartContext";
import { generateId } from "../../utils/generateId";
import { Addresses } from "../Addresses/Addresses";
import { Modal } from "../Modal/Modal";
import './CartDetail.css';

export function CartDetail({ productList }) {

    const { user } = useContext(AuthContext)
    const { confirmCart } = useContext(CartContext)

    const navigate = useNavigate()

    const [comment, setComment] = useState(null)
    const [addComment, setAddComment] = useState(null)
    const [totalPrice, setTotalPrice] = useState(null)
    const [address, setAddress] = useState(null)
    const [addresses, setAddresses] = useState(null)
    const [message, setMessage] = useState(null)
    const [changeAddress, setChangeAddress] = useState(null)

    async function getAddress(userId) {
        const response = await fetch(`${url}/user/${userId}`)

        if (!response.ok) {
            setAddresses([])
            return
        }

        const addresses = await response.json()

        setAddresses(addresses)

        const sessionAddress = localStorage.getItem('address')

        if (sessionAddress) {
            setAddress(JSON.parse(sessionAddress))
            return
        }

        addresses.forEach(e => {
            e.status && setAddress(e)
        })

    }

    async function confirm() {

        if (!address) {
            setMessage('No hay un dirección seleccionada para el pedido')
            return
        }

        const data = {
            id: generateId(),
            user_id: user.uid,
            user_name: user.displayName,
            date: new Date().getTime(),
            comment,
            address
        }

        try {
            const order_id = await confirmCart(data)

            navigate('/pedido/confirmado/' + order_id)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setTotalPrice(
            productList.reduce((total, e) => {
                const price = e.product.price
                const discount = e.product.discount || 0
                const discountedPrice = price - (price * discount / 100)
                return total + (discountedPrice * e.quantity)
            }, 0)
        )

        getAddress(user.uid)
    }, [productList])

    useEffect(() => {
        user && getAddress(user.uid)
    }, [user])

    useEffect(() => {
        setAddress(changeAddress)
        setAddresses([changeAddress])
    }, [changeAddress])

    return (
        <>
            <section className="cart-detail">
                <div className="cart-detail-info">
                    <h4>Detalle del pedido</h4>
                    <p>Precio total: <span>${totalPrice % 1 === 0 ? totalPrice : totalPrice.toFixed(2)}</span></p>
                    <p>El precio no incluye el costo del envio</p>
                    {addresses &&
                        <div>
                            <p>Tu pedido se envia a</p>
                            <div>
                                {addresses.length != 0 ?
                                    address &&
                                    <div className="address-for-order">
                                        <p className="order-address-selected">
                                            {address.address} {address.address_number}
                                            <BtnChangeAddress
                                                user={user}
                                                text={'Cambiar'}
                                                onChange={setChangeAddress}
                                                change={changeAddress}
                                            />
                                        </p>
                                        <p>{address.city}, {address.province}</p>
                                    </div> :
                                    <div className="address-for-order">
                                        <p>No hay direcciones registradas</p>
                                        <BtnChangeAddress
                                            user={user}
                                            text={'Agregar nueva dirección'}
                                            onChange={setChangeAddress}
                                            change={changeAddress}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    <div>
                        <button className="btn" onClick={() => setAddComment(!addComment)}>
                            Agregar comentario
                            <FontAwesomeIcon icon={addComment ? faAngleUp : faAngleDown} />
                        </button>
                        {addComment &&
                            <textarea
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Agrega un comentario al pedido"
                            >
                            </textarea>
                        }
                    </div>
                    {message &&
                        <div>
                            <p className="message-error">{message}</p>
                        </div>
                    }
                    <div className="cart-detail-container-btn">
                        <button onClick={confirm} className="btn btn-solid">Confirmar pedido</button>
                        <Link to={'/'} className="btn btn-regular">Seguir comprando</Link>
                    </div>
                </div>
            </section >
        </>
    )
}

function BtnChangeAddress({ text, user, onChange, change }) {

    const [modal, setModal] = useState(null)

    useEffect(() => {
        setModal(null)
    }, [change])

    return (
        <>
            <button
                className="btn-change-address" onClick={() => setModal(true)}
            >
                {text}
            </button>
            {modal &&
                <Modal onClose={setModal}>
                    <Addresses user={user} type={'MODAL'} onChange={onChange} />
                </Modal>
            }
        </>
    )
}