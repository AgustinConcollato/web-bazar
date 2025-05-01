import { api } from '../../services/api'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Loading } from '../Loading/Loading'
import { Pagination } from '../Pagination/Pagination'
import { ProductCard } from '../ProductCard/ProductCard'
import { ProductFilters } from '../ProductFilters/ProductFilters'
import { Filters } from '../Filters/Filters'
import './ProductList.css'

export function ProductList() {

    const { Products } = api

    const { categoryCode, subcategoryCode } = useParams()

    const [pageData, setPageData] = useState(null)
    const [productList, setProductList] = useState(null)

    const [searchParams, setSearchParams] = useSearchParams();

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        if (newPage !== 1) {
            newParams.set("page", newPage);
        } else {
            newParams.delete("page");
        }
        setSearchParams(newParams);
    };

    async function getProducts(category, subcategory) {
        const products = new Products()

        const options = {
            category,
            page: searchParams.get("page") || 1,
            subcategory,
            price: searchParams.get("price")
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
    }, [categoryCode, searchParams, subcategoryCode])

    useEffect(() => {
        const newParams = new URLSearchParams();
        setSearchParams(newParams);
    }, [categoryCode, subcategoryCode])

    return (
        <section className='product-list-page'>
            <Filters category={categoryCode} />
            <div className='container-product-list'>
                <div>
                    <ProductFilters totalProducts={pageData?.total} />
                </div>
                {pageData ?
                    productList.length != 0 ?
                        <>
                            <ul className='product-list'>
                                {productList.map(e => <ProductCard key={e.id} e={e} />)}
                            </ul>
                            <Pagination
                                currentPage={parseInt(searchParams.get("page")) || 1}
                                lastPage={pageData.last_page}
                                onPageChange={handlePageChange}
                            />
                        </>
                        :
                        <div>
                            <p>No hay productos</p>
                        </div>
                    :
                    <Loading />
                }
            </div >
        </section>

    )
}