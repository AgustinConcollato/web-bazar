import { Link, useParams } from "react-router-dom"
import { ProductDetail } from "../components/ProductDetail/ProductDetail"
import { useEffect, useState } from "react"
import { api } from "api-services"
import { Loading } from "../components/Loading/Loading"
import { RelatedProducts } from "../components/RelatedProducts/RelatedProducts"

export function ProductDetailPage() {

    const { productId } = useParams()

    const [product, setProduct] = useState(null)
    const [notFound, setNotFound] = useState(false)

    async function getProduct(id) {

        const { Products } = api
        const products = new Products()

        try {
            const response = await products.search({ id })

            if (response.status == 'error') {
                throw new Error()
            }

            setProduct(response.product)

        } catch (error) {
            setNotFound(true)
        }
    }

    useEffect(() => {
        setProduct(null)
        getProduct(productId)
    }, [productId])


    if (notFound) {

        document.title = 'Producto no encontrado o no existe'

        return (
            <section className="product-page">
                <div className="product-not-found">
                    <p>Producto no encontrado o no existe</p>
                    <Link to={'/'} className="btn btn-solid">Volver al inicio</Link>
                </div>
            </section>
        )
    }


    return (
        product ?
            <>
                <ProductDetail product={product} />
                <RelatedProducts product={product} type={'NAME'} />
                {/* <RelatedProducts product={product} type={'CATEGORY'} /> */}
            </> :
            <Loading />

    )
}