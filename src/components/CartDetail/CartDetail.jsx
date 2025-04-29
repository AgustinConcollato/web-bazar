import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './CartDetail.css';

export function CartDetail({ productList, cart }) {


    const [totalPrice, setTotalPrice] = useState(null)

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

    return (
        <>
            <section className="cart-detail">
                <div className="cart-detail-info">
                    <h4>Detalle del pedido</h4>
                    <p>Productos <span>{cart.length}</span></p>
                    <p>Unidades
                        <span>
                            {cart.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.quantity,
                                0,
                            )}
                        </span>
                    </p>
                    <h3>Precio total <span>${totalPrice % 1 === 0 ? totalPrice : totalPrice.toFixed(2)}</span></h3>
                    <div className="cart-detail-container-btn">
                        <Link to={'/pedido/confirmar'} className="btn btn-solid">Continuar con el pedido</Link>
                    </div>
                </div>
            </section >
        </>
    )
}