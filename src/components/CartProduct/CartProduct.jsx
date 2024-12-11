import { api, urlStorage } from "api-services"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/authContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import './CartProduct.css'

export function CartProduct({ e, onDelete }) {

    const { user } = useContext(AuthContext)
    const { product, quantity: q } = e
    const { ShoppingCart } = api

    const [images, setImages] = useState(JSON.parse(product.images))
    const [thumbnails, setThumbnails] = useState(JSON.parse(product.thumbnails))
    const [newQuantity, setNewQuantity] = useState(q)
    const [quantity, setQuantity] = useState(q)
    const [disabled, setDisabled] = useState(false)

    async function updateQuantity(e) {
        e.preventDefault()

        const shoppingCart = new ShoppingCart()

        try {
            setDisabled(true)

            const data = {
                quantity: parseInt(quantity),
                product_id: product.id,
                user_id: user.uid
            }

            const respones = await shoppingCart.update(data)

            console.log(respones)

            if (respones) {
                setNewQuantity(respones.quantity)
                setDisabled(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setThumbnails(JSON.parse(product.thumbnails))
    }, [e])

    return (
        <div className="cart-product">
            <img src={urlStorage + '/' + thumbnails[0]} alt="" />
            <div>
                <Link to={'/producto/' + product.id}>{product.name}</Link>
                <div>
                    <span onClick={() => onDelete({ userId: user.uid, productId: product.id })}>Eliminar del pedido</span>
                </div>
            </div>
            <form onSubmit={updateQuantity}>
                <input
                    className="input"
                    type="number"
                    value={newQuantity != quantity ? quantity : newQuantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min={1}
                    disabled={disabled}
                />
                {newQuantity != quantity && <button className="btn btn-solid" type="submit">{disabled ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Actualizar'}</button>}
            </form>
            <p>$ {product.price}</p>
            <p>$ {product.price * quantity}</p>
        </div>
    )
}