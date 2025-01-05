import { faBasketShopping, faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import './FormAddProductToCart.css';
import { Link } from "react-router-dom";
import { api } from "api-services";

export function FormAddProductToCart({ type, product }) {

    const { user } = useContext(AuthContext)

    const [hidden, setHidden] = useState(true)
    const [error, setError] = useState(false)
    const [addStatus, setAddStatus] = useState(true)
    const [timeoutId, setTimeoutId] = useState(null)

    async function addCart(e) {
        e.preventDefault()

        if (!user) {
            if (hidden) {
                setHidden(false);

                const newTimeoutId = setTimeout(() => {
                    setHidden(true);
                }, 5000);

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                setTimeoutId(newTimeoutId);
            }
            return
        }

        const quantity = e.target[0].value

        if (!quantity && quantity == 0) {
            setError('Completa con la cantidad para agregar al pedido')
            return
        }

        const { ShoppingCart } = api

        const shoppingCart = new ShoppingCart()

        setAddStatus(false)
        const response = await shoppingCart.add({
            quantity,
            user_id: user.uid,
            product_id: product.id
        })

        if (response) {
            setAddStatus(true)
        }
    }

    return (
        <>
            <form onSubmit={addCart} className="form-add-product-to-cart">
                {type == 'CARD' ?
                    <>
                        <input type="number" name="quantity" min={1} className="input" placeholder='Cantidad' />
                        <div>
                            <button type='submit' className="btn btn-regular">{addStatus ? <FontAwesomeIcon icon={faBasketShopping} /> : <FontAwesomeIcon icon={faCircleNotch} spin />}</button>
                            <span>Agregar al pedido</span>
                        </div>
                    </> :
                    <>
                        <input type="number" name="quantity" min={1} className="input" placeholder='Cantidad' onChange={() => setError(false)} />
                        <div>
                            <button type='submit' className="btn btn-solid">{addStatus ? 'Agregar al pedido' : <FontAwesomeIcon icon={faCircleNotch} spin />}</button>
                        </div>
                    </>
                }
            </form>
            {(error && type == 'DETAIL') && <p className="message-error">{error}</p>}
            {!hidden &&
                <div className="message-not-auth">
                    <p>Ingresa a tu cuenta para agregar productos al pedido</p>
                    <Link to={'/iniciar-sesion'} className="btn btn-thins">Ingresar</Link>
                </div>
            }
        </>
    )
}