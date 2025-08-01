import { useParams } from "react-router-dom"
import { useCampaign } from "../../hooks/useCampaign"
import { Loading } from "../../components/Loading/Loading"
import './CampaignPage.css'
import { useState } from "react"
import { Pagination } from "../../components/Pagination/Pagination"
import { ProductCard } from "../../components/ProductCard/ProductCard"

export function CampaignPage() {

    const [page, setPage] = useState(1)

    const { slug } = useParams()
    const { error, campaigns, loading } = useCampaign(slug, page)

    if (loading) {
        return <section><Loading /></section>
    }

    if (error) {
        return (
            <section className="campaign-error">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error.message}</p>
                    {error.status === 404 && (
                        <p className="error-suggestion">
                            La campaña que buscas no está disponible o no existe.
                        </p>
                    )}
                    {error.status === 400 && (
                        <p className="error-suggestion">
                            Esta campaña no está disponible en este momento.
                        </p>
                    )}
                </div>
            </section>
        )
    }

    return (
        <section>
            {campaigns && (
                <div className="campaing">
                    <h1>{campaigns.name}</h1>
                    <p>{campaigns.description}</p>
                    <div className="product-list">
                        {campaigns?.products?.data.map(product => <ProductCard e={product} />)}
                    </div>
                    <Pagination
                        currentPage={campaigns?.products?.current_page}
                        lastPage={campaigns?.products?.last_page}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </section>
    )
}