import { api, urlStorage } from "api-services"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/authContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import './CartProduct.css'
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons"

export function CartProduct({ e, onDelete, setProductList }) {

    const { user } = useContext(AuthContext)
    const { product, quantity: q } = e
    const { ShoppingCart } = api

    const [thumbnails, setThumbnails] = useState(JSON.parse(product.thumbnails))
    const [newQuantity, setNewQuantity] = useState(q)
    const [quantity, setQuantity] = useState(q)
    const [price, setPrice] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [discountedPrice, setDiscountedPrice] = useState(0)

    async function updateQuantity(e) {
        e.preventDefault()

        if (newQuantity == quantity) return

        const shoppingCart = new ShoppingCart()

        try {
            setDisabled(true)

            const data = {
                quantity: parseInt(quantity),
                product_id: product.id,
                user_id: user.uid
            }

            const response = await shoppingCart.update(data)

            if (response) {
                setNewQuantity(response.quantity)
                setProductList((prevList) =>
                    prevList.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: response.quantity }
                            : item
                    )
                )
                setDiscountedPrice(((product.price * response.quantity) - (product.discount * (product.price * response.quantity)) / 100))
                setPrice(product.price * response.quantity)
                setDisabled(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setThumbnails(JSON.parse(product.thumbnails))
        setDiscountedPrice(((product.price * quantity) - (product.discount * (product.price * quantity)) / 100))
        setPrice(product.price * quantity)
    }, [e])

    return (
        <div className="cart-product">
            <Link to={'/producto/' + product.id}>
                <img src={urlStorage + '/' + thumbnails[0]} alt="" />
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
                        onChange={(e) => setQuantity(e.target.value || 1)}
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
            {!product.discount ?
                <div className="cart-product-price">
                    <p>${price}</p>
                </div> :
                <div className="cart-product-discount">
                    <div><span>-{product.discount}% </span><p>${price}</p></div>
                    <p>${discountedPrice % 1 === 0 ? discountedPrice : discountedPrice.toFixed(2)}</p>
                </div>
            }
            <div>
                <button
                    onClick={() => onDelete({ userId: user.uid, productId: product.id })}
                    className="btn btn-error-thins"
                >
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
        </div >
    )
}