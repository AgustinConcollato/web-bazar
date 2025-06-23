import { useState, useEffect } from "react";
import { Campaign } from "../services/campaignServices";

export function useCampaign(slug = null) {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [campaigns, setCampaings] = useState([])

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await new Campaign().get({ slug })
                setCampaings(response)
            } catch (error) {
                console.error('Error fetching campaign:', error)
                setError({
                    message: error.message,
                    status: error.status,
                    data: error.data
                })
            } finally {
                setLoading(false)
            }
        }

        fetchCampaign()
    }, [slug])

    return { error, campaigns, loading }
}
