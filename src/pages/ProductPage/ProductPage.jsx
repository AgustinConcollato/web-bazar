import { Link, useParams } from "react-router-dom"
import { ProductDetail } from "../../components/ProductDetail/ProductDetail"
import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { Loading } from "../../components/Loading/Loading"
import { RelatedProducts } from "../../components/RelatedProducts/RelatedProducts"
import { RecommendCategories } from "../../components/RecommendCategories/RecommendCategories"
import './ProductPage.css'

export function ProductPage() {

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

            const { product } = response

            if (product.campaign_discount && product.campaign_discount.type == "percentage") {
                product.discount = product.campaign_discount.value
            }

            setProduct(product)

        } catch (error) {
            setNotFound(true)
        }
    }

    useEffect(() => {
        setProduct(null)
        getProduct(productId)
        scrollTo(0, 0)
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
        <section className="product-page">
            {product ?
                <>
                    <RecommendCategories product={product} />
                    <ProductDetail product={product} />
                    <RelatedProducts product={product} />
                </> :
                <Loading />
            }
        </section>

    )
}