import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './CartDetail.css';

export function CartDetail({ productList }) {


    const [totalPrice, setTotalPrice] = useState(null)

    useEffect(() => {
        setTotalPrice(
            productList.reduce((total, e) => {
                const price = e.product.price
                let discountedPrice = price

                // Priorizar descuento de campaña sobre descuento del producto
                if (e.product.campaign_discount) {
                    if (e.product.campaign_discount.type === "percentage") {
                        discountedPrice = price - (price * e.product.campaign_discount.value / 100)
                    } else {
                        // Descuento fijo
                        discountedPrice = Math.max(0, price - e.product.campaign_discount.value)
                    }
                } else if (e.product.discount) {
                    discountedPrice = price - (price * e.product.discount / 100)
                }

                return total + (discountedPrice * e.quantity)
            }, 0)
        )

    }, [productList])

    return (
        <>
            <section className="cart-detail">
                <div className="cart-detail-info">
                    <h3>Subtotal
                        <span>
                            {/* {typeof totalPrice === 'number'
                                ? `$${totalPrice >= 300000
                                    ? (totalPrice - ((5 * totalPrice) / 100)).toLocaleString()
                                    : totalPrice.toLocaleString()}`
                                : '$0'
                            } */}
                            ${typeof totalPrice === 'number' ? totalPrice.toLocaleString() : '$0'}
                        </span>
                    </h3>
                    <div className="cart-detail-container-btn">
                        <Link to={'/pedido/confirmar'} className="btn btn-solid">Continuar con el pedido</Link>
                    </div>
                </div>
            </section >
        </>
    )
}