import { api } from 'api-services'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Loading/Loading'
import { Pagination } from '../Pagination/Pagination'
import { ProductCard } from '../ProductCard/ProductCard'
import { Filters } from '../Filters/Filters'
import './ProductList.css'

export function ProductList() {

    const { Products } = api

    const { categoryCode, subcategoryCode } = useParams()

    const [pageData, setPageData] = useState(null)
    const [productList, setProductList] = useState(null)
    const [page, setPage] = useState(1)

    async function getProducts(category, subcategory) {
        const products = new Products()

        const options = {
            category,
            page,
            subcategory
        }

        const dataPage = await products.search({ options })

        setPageData(dataPage)
        setProductList(dataPage.data)
    }

    useEffect(() => {
        setPageData(null)
        setProductList(null)
        getProducts(categoryCode, subcategoryCode)

        window.scrollTo(0, 0)
    }, [categoryCode, page, subcategoryCode])

    useEffect(() => {
        setPage(1)
    }, [categoryCode, subcategoryCode])

    return (
        <>
            <Filters category={categoryCode} />
            {pageData ?
                productList.length != 0 ?
                    <div className='container-product-list'>
                        <ul className='product-list'>
                            {productList.map(e => <ProductCard key={e.id} e={e} />)}
                        </ul>
                        <Pagination currentPage={pageData.current_page} lastPage={pageData.last_page} onPageChange={setPage} />
                    </div >
                    :
                    <div>
                        <p>No hay productos</p>
                    </div>
                :
                <Loading />
            }
        </>

    )
}