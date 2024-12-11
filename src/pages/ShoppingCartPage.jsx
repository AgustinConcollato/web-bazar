import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import { Link, useNavigate } from "react-router-dom"
import { api } from "api-services"
import { Loading } from "../components/Loading/Loading"
import { CartProduct } from "../components/CartProduct/CartProduct"
import { generateId } from "../utils/generateId"

export function ShoppingCartPage() {

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const { ShoppingCart } = api
    const shoppingCart = new ShoppingCart()

    const [productList, setProductList] = useState(null)
    const [loading, setLoading] = useState(null)
    const [comment, setComment] = useState(null)

    async function getShoppingCart() {
        document.title = 'Tu pedido'

        const response = await shoppingCart.get(user.uid)

        setProductList(response)
    }

    async function deleteProduct(data) {
        setLoading(true)

        try {
            const response = await shoppingCart.delete(data)

            setProductList(current => {
                return current.filter(e => e.product_id != response.product_id && e)
            })
            setLoading(null)
        } catch (error) {
            console.log(error)
        }
    }

    async function confirmCart() {
        const data = {
            id: generateId(),
            user_id: user.uid,
            user_name: user.displayName,
            date: new Date().getTime(),
            comment
        }

        const response = await fetch('http://localhost:8000/api/cart/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            return
        }

        const { order_id } = await response.json()

        navigate('/pedido/confirmado/' + order_id)
    }

    useEffect(() => {
        user && getShoppingCart()
    }, [user])

    if (!user) {

        document.title = 'Iniciar sesión para ver tu pedido'

        return (
            <section className="shopping-cart-page">
                <div className="shopping-cart-not-user">
                    <p>Iniciar sesión para ver tu carrito</p>
                    <Link to={'/iniciar-sesion'} className="btn btn-regular">Ingresar</Link>
                    <Link to={'/registrarse'} className="btn btn-solid">Registarse</Link>
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="shopping-cart-page">
                <div>
                    {(productList && !loading) ?
                        productList.length != 0 ?
                            <>
                                {productList.map((e, i) => <CartProduct key={i} e={e} onDelete={deleteProduct} />)}
                                <textarea onChange={(e) => setComment(e.target.value)} placeholder="Agregar un comentario al pedido"></textarea>
                            </> :
                            <div>
                                Tu pedido todavía no tiene productos
                            </div> :
                        <Loading />
                    }
                </div>
                <div className="cartDetail">
                    {(productList && !loading && productList.length != 0) &&
                        <>
                            {productList.reduce((a, e) => a + (e.product.price * e.quantity), 0)}
                            <button onClick={confirmCart}>confirmar</button>
                        </>
                    }
                </div>
            </section >
        </>
    )
}