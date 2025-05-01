import { useEffect, useRef, useState } from "react"
import { api } from "../../services/api"
import { ProductCard } from "../ProductCard/ProductCard"
import './RelatedProducts.css'

export function RelatedProducts({ product }) {
    const { Products } = api

    const [productList, setProductList] = useState(null)

    const containerRef = useRef(null)

    async function getProducts() {
        const products = new Products()
        try {
            const response = products.related(product.id)
            const data  = await response
            setProductList(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        setProductList(null)
        getProducts()
    }, [product.id])

    return (
        productList && productList.length > 0 &&
        <div className="related-products">
            <h2>Productos relacionados</h2>
            <div className="container-related-products" ref={containerRef}>
                {productList.map(e => <ProductCard e={e} />)}
            </div>
        </div>
    )
}
