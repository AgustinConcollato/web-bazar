import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { url } from "../../services/api";
import { Addresses } from "../Addresses/Addresses";
import { Modal } from "../Modal/Modal";
import './CartDetail.css';

export function CartDetail({ productList }) {

    const { client } = useContext(AuthContext)

    const [totalPrice, setTotalPrice] = useState(null)
    const [address, setAddress] = useState(null)
    const [addresses, setAddresses] = useState(null)
    const [message, setMessage] = useState(null)
    const [changeAddress, setChangeAddress] = useState(null)

    async function getAddress(clientId) {
        const response = await fetch(`${url}/user/${clientId}`)

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
            if (e.status) {
                setAddress(e)
                return
            }
        });

        if (!address) {
            setAddress(addresses[0])
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

    }, [productList])

    useEffect(() => {
        client && getAddress(client.id)
    }, [client])

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
                                                client={client}
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
                                            client={client}
                                            text={'Agregar nueva dirección'}
                                            onChange={setChangeAddress}
                                            change={changeAddress}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {message &&
                        <div>
                            <p className="message-error">{message}</p>
                        </div>
                    }
                    <div className="cart-detail-container-btn">
                        <Link to={'/pedido/confirmar'} className="btn btn-solid">Continuar con el pedido</Link>
                        <Link to={'/'} className="btn btn-regular">Seguir comprando</Link>
                    </div>
                </div>
            </section >
        </>
    )
}

function BtnChangeAddress({ text, client, onChange, change }) {

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
                    <Addresses client={client} type={'MODAL'} onChange={onChange} />
                </Modal>
            }
        </>
    )
}