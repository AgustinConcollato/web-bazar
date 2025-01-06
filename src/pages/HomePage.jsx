import { useEffect, useState } from "react";
import { Loading } from "../components/Loading/Loading";
import { SectionCategoriesHome } from "../components/SectionCategoriesHome/SectionCategoriesHome";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { api } from "api-services";

export function HomePage() {

    const { Products, Address } = api

    const [productsList, setProductsList] = useState(null);

    async function getProducts() {
        const products = new Products()

        const options = {
            category: 'CAT002',
            page: 1
        }

        const dataPage = await products.search({ options })

        setProductsList(dataPage.data)
    }

    useEffect(() => {

        document.title = 'Bazarshop'
        getProducts()
    }, [])


    return (
        <>
            <section className="section-products-home" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {productsList ?
                    productsList.length > 0 ?
                        productsList.map(e => <ProductCard key={e.id} e={e} />) :
                        <p>No hay productos en esta categoría</p>
                    : <Loading />}
            </section>
            <SectionCategoriesHome />
        </>
    )
}