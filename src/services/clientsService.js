import { urlClients as url } from "./api";

export class Clients {

    constructor() {
        this.token = localStorage.getItem('token')
    }

    // solicitar cambio de tipo de cuenta
    async requestChangeAccountType(data) {
        try {
            const response = await fetch(`${url}/request-change-account-type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            const result = await response.json()
            return result
        } catch (error) {
            throw error
        }
    }
}
