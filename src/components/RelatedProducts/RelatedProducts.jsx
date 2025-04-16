import { api } from "../../services/api"
import { useContext, useEffect, useRef, useState } from "react"
import { CategoriesContext } from "../../context/CategoriesContext"
import { ProductCard } from "../ProductCard/ProductCard"

export function RelatedProducts({ product, type }) {
    const { categories } = useContext(CategoriesContext)
    const { Products } = api

    const [category, setCategory] = useState({})
    const [productList, setProductList] = useState(null)

    const containerRef = useRef(null)

    async function getProducts() {
        const products = new Products()

        const options = {
            name: type == product.name.split(' ')[0],
            page: 1,
            category: type == product.category_id,
        }

        try {
            const response = products.search({ options })

            const { data } = await response

            if (data.length > 10) {
                setProductList(data.slice(0, 10))
                return
            }

            setProductList(data)
        } catch (error) {

        }
    }

    useEffect(() => {
        setProductList(null)
        getProducts()
    }, [product.id])

    useEffect(() => {
        if (categories) {
            setCategory(...categories.filter(e => e.category_code == product.category_id))
        }
    }, [categories])

    function scroll(direction) {
        const scrollAmount = 460 // Cantidad de píxeles a desplazar
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth',
            })
        }
    }

    return (
        <section className="related-products">
            <div>
                <h3>Relacionados de <span>{type == 'NAME' ? product.name : category.category_name}</span></h3>
                {productList && productList.length > 5 &&
                    <div className="scroll-buttons">
                        <button onClick={() => scroll('left')}>⬅️</button>
                        <button onClick={() => scroll('right')}>➡️</button>
                    </div>
                }
            </div>
            <div className="container-related-products" ref={containerRef}>
                {productList && productList.length > 1
                    ? productList.map(e => e.id != product.id && <ProductCard e={e} />)
                    : <p>No hay productos relacionados por nombre</p>}
            </div>
        </section>
    )
}
