import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import { Loading } from "../components/Loading/Loading"
import { formatDate } from "../utils/formatDate"
import { urlOrder, urlStorage } from "api-services"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { NotFoundPage } from "./NotFoundPage"
import { Order } from "api-services/ordersService"
import { OrderDetails } from "../components/OrderDetails/OrderDetails"
import { AllOrders } from "../components/AllOrders/AllOrders"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"

export function OrdersPage() {

    const { user } = useContext(AuthContext)

    const [orders, setOrders] = useState(null)

    async function getOrders() {
        const response = await fetch(`${urlOrder}/user/${user.uid}`)
        const orders = await response.json()

        setOrders(orders)
    }

    useEffect(() => {
        if (user) {
            getOrders()
        }
    }, [user])

    return (
        <section className="orders-page">

            <Routes>
                <Route path='' element={<AllOrders orders={orders} />} />
                <Route path='/:id' element={<Details />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes >
        </section>
    )
}

function Details() {

    const orders = new Order()
    const { id } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState(null)
    const [address, setAddress] = useState(null)
    const [products, setProducts] = useState(null)

    async function getOrder() {
        try {
            const response = await orders.get(id)

            setAddress(JSON.parse(response.address))
            setOrder(response)
            setProducts(response.products)
        } catch (error) {
            navigate('/compras')
        }
    }

    useEffect(() => {
        setOrder(null)
        getOrder()
    }, [id])

    return (
        <>
            <Link to="/compras" style={{ marginBottom: '30px', display: 'block' }}><FontAwesomeIcon icon={faAngleLeft} /> Volver a mis pedidos</Link>
            <div className="order-confirmed">
                {order ?
                    <>
                        <OrderDetails order={order} address={address} />
                        <div className="container-order-product-table">
                            {products &&
                                <table className="order-product-table" cellSpacing={0}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, i) => (
                                            <tr className="order-product" key={product.product_id}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <Link to={`/producto/${product.product_id}`}>
                                                        <img
                                                            src={urlStorage + '/' + JSON.parse(product.picture)[0]}
                                                            alt={product.name}
                                                            className="product-image"
                                                        />
                                                        {product.name}
                                                    </Link>
                                                </td>
                                                <td>{product.quantity}</td>
                                                <td>{product.discount ?
                                                    <>
                                                        <p className="discount">
                                                            <span>-{product.discount}%</span>
                                                            <p className="price">${parseFloat(product.price)}</p>
                                                        </p>
                                                        <p>${parseFloat(product.price - (product.discount * product.price) / 100)}</p>
                                                    </> :
                                                    <p>${parseFloat(product.price)}</p>
                                                }</td>
                                                <td>${parseFloat(product.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                        </div>
                    </> :
                    <Loading />}
            </div>
        </>

    )
}