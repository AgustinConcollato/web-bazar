import { urlCampaigns as url } from './api'

export class Campaign {
    constructor() {
        this.url = url
    }

    async get({ slug = null, page = 1 } = {}) {

        let fullUrl = url

        if (slug) {
            fullUrl += `/${slug}`
        }

        fullUrl += `?page=${page}`

        try {
            const response = await fetch(fullUrl)

            if (!response.ok) {
                const errorData = await response.json()
                const error = new Error(errorData.error || 'Error al cargar la campaña')
                error.status = response.status
                error.data = errorData
                throw error
            }

            return await response.json()

        } catch (error) {
            throw error
        }
    }
}