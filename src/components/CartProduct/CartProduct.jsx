import { faTrashAlt } from "@fortawesome/free-regular-svg-icons"
import { faCheck, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/authContext"
import { CartContext } from "../../context/CartContext"
import { urlStorage } from "../../services/api"
import './CartProduct.css'

export function CartProduct({ e, onDelete, setProductList }) {

    const { client } = useContext(AuthContext)
    const { updateProductCart } = useContext(CartContext)

    const { product, quantity: q } = e

    const [thumbnails, setThumbnails] = useState(JSON.parse(product.thumbnails))
    const [newQuantity, setNewQuantity] = useState(q)
    const [quantity, setQuantity] = useState(q)
    const [price, setPrice] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [discountedPrice, setDiscountedPrice] = useState(0)

    async function updateQuantity(e) {
        e.preventDefault()

        if (newQuantity == quantity) return

        const q = parseInt(quantity) || 1

        if (quantity < 1) {
            setQuantity(q)
            setNewQuantity(q)
            return
        }

        const data = {
            quantity: q,
            product_id: product.id,
            client_id: client.id
        }

        try {
            setDisabled(true)

            const response = await updateProductCart(data)

            if (response) {
                setNewQuantity(response.quantity)
                setProductList((prevList) =>
                    prevList.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: response.quantity }
                            : item
                    )
                )

                // Recalcular precio con descuento
                let finalPrice = product.price * response.quantity;
                let discountPercentage = 0;

                if (product.campaign_discount) {
                    if (product.campaign_discount.type === "percentage") {
                        discountPercentage = product.campaign_discount.value;
                        finalPrice = finalPrice - (finalPrice * discountPercentage / 100);
                    } else {
                        finalPrice = (product.price - product.campaign_discount.value) * response.quantity;
                    }
                } else if (product.discount) {
                    discountPercentage = product.discount;
                    finalPrice = finalPrice - (finalPrice * discountPercentage / 100);
                }

                setDiscountedPrice(finalPrice);
                setPrice(product.price * response.quantity);
                setDisabled(false);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setThumbnails(JSON.parse(product.thumbnails))

        // Calcular precio con descuento de campaña o descuento del producto
        let finalPrice = product.price * quantity;
        let discountPercentage = 0;

        if (product.campaign_discount) {
            // Usar descuento de campaña
            if (product.campaign_discount.type === "percentage") {
                discountPercentage = product.campaign_discount.value;
                finalPrice = finalPrice - (finalPrice * discountPercentage / 100);
            } else {
                // Descuento fijo
                finalPrice = (product.price - product.campaign_discount.value) * quantity;
            }
        } else if (product.discount) {
            // Usar descuento del producto
            discountPercentage = product.discount;
            finalPrice = finalPrice - (finalPrice * discountPercentage / 100);
        }


        setDiscountedPrice(finalPrice);
        setPrice(product.price * quantity);
    }, [product, quantity])

    return (
        <div className="cart-product">
            <Link to={'/producto/' + product.id}>
                <img src={urlStorage + '/' + thumbnails[0]} alt={product.name} />
                <p>
                    {product.name}
                </p>
            </Link>
            <form onSubmit={updateQuantity}>
                <div>
                    <input
                        className="input"
                        type="number"
                        value={newQuantity != quantity ? quantity : newQuantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min={1}
                        disabled={disabled}
                    />
                    {newQuantity != quantity &&
                        <button className="btn btn-solid" type="submit">
                            {disabled ?
                                <FontAwesomeIcon icon={faCircleNotch} spin /> :
                                <>
                                    <FontAwesomeIcon icon={faCheck} />
                                    <span>Actualizar</span>
                                </>
                            }
                        </button>
                    }
                </div>
            </form>
            {!product.campaign_discount && !product.discount ?
                <div className="cart-product-price">
                    <p>${price % 1 !== 0 ? price.toFixed(2) : price}</p>
                </div> :
                <div className="cart-product-discount">
                    <div>
                        {product.campaign_discount ? (
                            <>
                                <span>-{product.campaign_discount.type === "percentage" ? `${product.campaign_discount.value}%` : `$${product.campaign_discount.value}`} </span>
                                <p>${price % 1 !== 0 ? price.toFixed(2) : price}</p>
                            </>
                        ) : (
                            <>
                                <span>-{product.discount}% </span>
                                <p>${price % 1 !== 0 ? price.toFixed(2) : price}</p>
                            </>
                        )}
                    </div>
                    <p>${discountedPrice % 1 === 0 ? discountedPrice : discountedPrice.toFixed(2)}</p>
                </div>
            }
            <div>
                <button
                    onClick={() => onDelete({ clientId: client.id, productId: product.id })}
                    className="btn btn-error-thins"
                >
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
        </div >
    )
}