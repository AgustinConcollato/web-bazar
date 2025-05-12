import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import { Loading } from "../components/Loading/Loading"
import { urlStorage, api } from "../services/api"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { NotFoundPage } from "./NotFoundPage"
import { OrderDetails } from "../components/OrderDetails/OrderDetails"
import { AllOrders } from "../components/AllOrders/AllOrders"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"

export function OrdersPage() {

    const { client } = useContext(AuthContext)

    if (!client) {
        document.title = 'Iniciar sesión para ver tus compras'

        return (
            <section className="orders-page">
                <div className="shopping-cart-not-user">
                    <p>Ingresa a tu cuenta para ver tus compras</p>
                    <Link to={'/iniciar-sesion'} className="btn btn-regular">Ingresar</Link>
                </div>
            </section>
        )
    }

    return (
        <section className="orders-page">
            <Routes>
                <Route path='' element={<AllOrders client={client} />} />
                <Route path='/:id' element={<Details />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes >
        </section>
    )
}

function Details() {

    const { Order } = api
    const order = new Order()

    const { id } = useParams()
    const navigate = useNavigate()

    const [details, setDetails] = useState(null)
    const [address, setAddress] = useState(null)
    const [products, setProducts] = useState(null)

    async function getOrder() {
        try {
            const response = await order.detail(id)
            setAddress(JSON.parse(response.address))
            setDetails(response)
            setProducts(response.products)
        } catch (error) {
            navigate('/compras')
        }
    }

    useEffect(() => {
        setDetails(null)
        getOrder()
        document.title = 'Detalle del pedido'
        scrollTo(0, 0)
    }, [id])

    return (
        <>
            <Link to="/compras" style={{ marginBottom: '30px', display: 'block' }}><FontAwesomeIcon icon={faAngleLeft} /> Volver a mis pedidos</Link>
            <div className="order-confirmed">
                {details ?
                    <>
                        <OrderDetails order={details} address={address} />
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