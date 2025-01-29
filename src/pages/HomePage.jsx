import { useContext, useEffect, useState } from "react";
import { Loading } from "../components/Loading/Loading";
import { SectionCategoriesHome } from "../components/SectionCategoriesHome/SectionCategoriesHome";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { api } from "api-services";
import { AuthContext } from "../context/authContext";
import { Address } from "api-services/addressService";
import { Link } from "react-router-dom";

export function HomePage() {

    const { Products } = api
    const { user } = useContext(AuthContext)

    const [productsListDate, setProductsListDate] = useState(null);
    const [productsListViews, setProductsListViews] = useState(null);
    const [addresses, setAddresses] = useState([]);

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

    async function getAddress() {
        const address = new Address(user.uid)

        const response = await address.get()
        setAddresses(response)
    }

    useEffect(() => {
        document.title = 'Bazarshop'
        getProductsByCreationDate()
        getProductsByViews()
    }, [])

    useEffect(() => {
        user && getAddress()
    }, [user])


    return (
        <>
            {addresses.length == 0 &&
                <section className="section-address-home">
                    <p>Agrega una dirección para poder realizar tus pedidos <Link to={'/perfil'} className="btn btn-regular">Agrergar</Link></p>
                </section>
            }
            <section className="section-products-home">
                <h2 style={{ flex: 'none' }}>Más relevantes</h2>
                {productsListViews ?
                    productsListViews.length > 0 ?
                        productsListViews.map(e => <ProductCard key={e.id} e={e} />) :
                        <p>No hay productos en esta categoría</p>
                    : <Loading />}
            </section>
            <SectionCategoriesHome />
            <section className="section-products-home">
                <h2 style={{ flex: 'none' }}>Nuevos ingresos</h2>
                {productsListDate ?
                    productsListDate.length > 0 ?
                        productsListDate.map(e => <ProductCard key={e.id} e={e} />) :
                        <p>No hay productos en esta categoría</p>
                    : <Loading />}
            </section>
        </>
    )
}