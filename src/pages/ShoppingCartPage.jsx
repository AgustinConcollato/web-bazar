import { useContext, useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import { CartDetail } from "../components/CartDetail/CartDetail"
import { CartProduct } from "../components/CartProduct/CartProduct"
import { Loading } from "../components/Loading/Loading"
import { NavBar } from "../components/NavBar/NavBar"
import { OrderConfirmed } from "../components/OrderConfirmed/OrderConfirmed"
import { AuthContext } from "../context/authContext"
import { CartContext } from "../context/CartContext"
import { NotFoundPage } from "./NotFoundPage"
import { ConfirmOrder } from "../components/ConfirmOrder/ConfirmOrder"

export function ShoppingCartPage() {

    const { user } = useContext(AuthContext)
    const { getCart, deleteProductCart } = useContext(CartContext)

    const [productList, setProductList] = useState(null)
    const [loading, setLoading] = useState(null)

    async function getShoppingCart() {
        document.title = 'Tu pedido'

        const response = await getCart()

        if (response.length == 0 && sessionStorage.getItem('address')) {
            sessionStorage.removeItem('address')
        }

        setProductList(response)
    }

    async function deleteProduct(data) {
        setLoading(true)

        try {
            const response = await deleteProductCart(data)

            setProductList(current => {
                if (current.length == 1 && sessionStorage.getItem('address')) {
                    sessionStorage.removeItem('address')
                }

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
        <Routes>
            <Route path='/' element={
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
            } />
            <Route path='/confirmar' element={<ConfirmOrder user={user} />} />
            <Route path='/confirmado/:id' element={<OrderConfirmed />} />
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    )
}