import { Route, Routes } from "react-router-dom";
import { ProductList } from "../components/ProductList/ProductList";

export function ProductPage() {
    return (
        <section className="product-page">
            <Routes>
                <Route path="" element={
                    <ProductList />
                } />
                <Route path="/:subcategoryCode" element={
                    <ProductList />
                } />
            </Routes>
        </section>
    )
}