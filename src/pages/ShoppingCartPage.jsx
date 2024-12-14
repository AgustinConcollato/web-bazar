import { api } from "api-services"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CartDetail } from "../components/CartDetail/CartDetail"
import { CartProduct } from "../components/CartProduct/CartProduct"
import { Loading } from "../components/Loading/Loading"
import { NavBar } from "../components/NavBar/NavBar"
import { AuthContext } from "../context/authContext"

export function ShoppingCartPage() {

    const { user } = useContext(AuthContext)
    const { ShoppingCart } = api
    const shoppingCart = new ShoppingCart()

    const [productList, setProductList] = useState(null)
    const [loading, setLoading] = useState(null)

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

    useEffect(() => {
        user && getShoppingCart()
    }, [user])

    if (!user) {

        document.title = 'Iniciar sesión para ver tu pedido'

        return (
            <section className="shopping-cart-page">
                <div className="shopping-cart-not-user">
                    <p>Ingresa a tu cuenta para ver tu pedido</p>
                    <Link to={'/iniciar-sesion'} className="btn btn-regular">Ingresar</Link>
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="shopping-cart-page">
                <div>
                    <h1>Tu pedido</h1>
                    {(productList && !loading) ?
                        productList.length != 0 ?
                            <div>
                                {productList.map((e, i) => <CartProduct key={i} e={e} onDelete={deleteProduct} setProductList={setProductList} />)}
                            </div> :
                            <div className="shopping-cart-empty">
                                <h2>Todavía no tiene productos</h2>
                                <p>Agrega lo que más te guste de las diferentes categorías <NavBar /></p>
                            </div> :
                        <Loading />
                    }
                </div>
                {(productList && productList.length != 0) &&
                    <CartDetail productList={productList} />
                }
            </section >
        </>
    )
}