import { useEffect, useRef, useState } from "react";
import { Loading } from "../../components/Loading/Loading";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { SectionCategoriesHome } from "../../components/SectionCategoriesHome/SectionCategoriesHome";
import { Shortcuts } from '../../components/Shortcuts/Shortcuts';
import { api } from "../../services/api";
import './HomePage.css';

export function HomePage() {

    const { Products } = api

    const [productsListDate, setProductsListDate] = useState(null);
    const [productsListViews, setProductsListViews] = useState(null);
    const [showOnlyPopular, setShowOnlyPopular] = useState(false);

    // Referencias para los contenedores de productos
    const newProductsRef = useRef(null);
    const popularProductsRef = useRef(null);

    // Función para hacer scroll horizontal
    const scrollProducts = (containerRef, direction) => {
        if (containerRef.current) {
            const scrollAmount = 800; // Cantidad de scroll en píxeles
            const currentScroll = containerRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            containerRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

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

        // Si hay menos de 5 productos, mostrar solo los populares
        if (dataPage.data.length < 5) {
            setShowOnlyPopular(true);
        }
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
        getProductsByViews();

        scrollTo(0, 0)
    }, [])

    return (
        <>
            <Shortcuts />
            {!showOnlyPopular && (
                <section className="section-products-home">
                    <div>
                        <h2>Nuevos ingresos</h2>
                        <div className="btn-nav">
                            <button onClick={() => scrollProducts(newProductsRef, 'left')}>{'<'}</button>
                            <button onClick={() => scrollProducts(newProductsRef, 'right')}>{'>'}</button>
                        </div>
                    </div>
                    {productsListDate ?
                        productsListDate.length > 0 ?
                            <div ref={newProductsRef} className="products-container">
                                {productsListDate.map(e => <ProductCard key={e.id} e={e} />)}
                            </div> :
                            <p>No hay productos en esta categoría</p>
                        : <Loading />}
                </section>
            )}
            <SectionCategoriesHome />
            <section className="section-products-home">
                <div>
                    <h2>Productos destacados</h2>
                    <div className="btn-nav">
                        <button onClick={() => scrollProducts(popularProductsRef, 'left')}>{'<'}</button>
                        <button onClick={() => scrollProducts(popularProductsRef, 'right')}>{'>'}</button>
                    </div>
                </div>
                {productsListViews ?
                    productsListViews.length > 0 ?
                        <div ref={popularProductsRef} className="products-container">
                            {productsListViews.map(e => <ProductCard key={e.id} e={e} />)}
                        </div> :
                        <p>No hay productos en esta categoría</p>
                    : <Loading />}
            </section>
        </>
    )
}