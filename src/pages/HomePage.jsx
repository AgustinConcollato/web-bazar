import { useEffect, useState } from "react";
import { Loading } from "../components/Loading/Loading";
import { SectionCategoriesHome } from "../components/SectionCategoriesHome/SectionCategoriesHome";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { api } from "api-services";

export function HomePage() {

    const { Products, Address } = api

    const [productsListDate, setProductsListDate] = useState(null);
    const [productsListViews, setProductsListViews] = useState(null);

    async function getProductsByCreationDate() {

        const currentDate = new Date()
        const pastDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        const pastDateInMilliseconds = pastDate.getTime()

        const options = {
            date: pastDateInMilliseconds,
            page: 1
        }

        const products = new Products()
        const dataPage = await products.search({ options })
        setProductsListDate(dataPage.data)
    }

    async function getProductsByViews() {

        const options = {
            views: true,
            page: 1
        }

        const products = new Products()
        const dataPage = await products.search({ options })
        setProductsListViews(dataPage.data)
    }

    useEffect(() => {
        document.title = 'Bazarshop'
        getProductsByCreationDate()
        getProductsByViews()
        // getAddress()
    }, [])


    return (
        <>
            <section className="section-products-home" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {productsListDate ?
                    productsListDate.length > 0 ?
                        productsListDate.map(e => <ProductCard key={e.id} e={e} />) :
                        <p>No hay productos en esta categoría</p>
                    : <Loading />}
            </section>
            <SectionCategoriesHome />
            <section className="section-products-home" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {productsListViews ?
                    productsListViews.length > 0 ?
                        productsListViews.map(e => <ProductCard key={e.id} e={e} />) :
                        <p>No hay productos en esta categoría</p>
                    : <Loading />}
            </section>
        </>
    )
}