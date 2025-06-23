import { useParams } from "react-router-dom"
import { useCampaign } from "../../hooks/useCampaign"
import { Loading } from "../../components/Loading/Loading"
import './CampaignPage.css'

export function CampaignPage() {

    const { slug } = useParams()

    const { error, campaigns, loading } = useCampaign(slug)

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
                <div>
                    <h1>{campaigns.name}</h1>
                    <p>{campaigns.description}</p>
                    {/* Aquí puedes agregar más contenido de la campaña */}
                </div>
            )}
        </section>
    )
}