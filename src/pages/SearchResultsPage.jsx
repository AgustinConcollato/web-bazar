import { Products } from "../services/productsService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Loading } from "../components/Loading/Loading";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { Pagination } from "../components/Pagination/Pagination";

export function SearchResultsPage() {

    const { productName } = useParams()

    const [productList, setProductList] = useState(null)
    const [pageData, setPageData] = useState(null)
    const [page, setPage] = useState(1)

    async function getProducts() {

        const product = new Products();

        try {
            const response = await product.search({
                options: {
                    name: productName,
                    page
                }
            });

            setProductList(response.data)
            setPageData(response)
        } catch (error) {

        }
    }

    useEffect(() => {
        setPageData(null)
        setProductList(null)
        getProducts()
        window.scrollTo(0, 0)
    }, [productName, page])

    useEffect(() => {
        setPage(1)
        document.title = `Resultados de "${productName}" - Bazarshop`
    }, [productName])

    return (
        <section style={{ minHeight: 'calc(100vh - 375px)' }}>
            <h1 style={{ fontWeight: '500', fontSize: '20px', marginBottom: '20px' }}>Resultados de "{productName}"</h1>
            {productList ?
                productList.length != 0 ?
                    <>
                        <ul className="product-list">
                            {productList.map(product => (
                                <ProductCard e={product} />
                            ))}
                        </ul>
                        <Pagination currentPage={pageData.current_page} lastPage={pageData.last_page} onPageChange={setPage} />
                    </>
                    : <p>No se encontraron resultados</p>
                : <Loading />}
        </section>
    )
}