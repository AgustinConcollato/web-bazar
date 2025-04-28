import { urlMail as url } from './api'

export class Mail {
    constructor() {
        this.token = localStorage.getItem('token')
        this.url = url
    }

    async request(endpoint, { method, headers = {}, body = null } = {}) {
        try {
            const defaultHeaders = {
                'Authorization': `Bearer ${this.token}`,
                ...headers
            }

            const response = await fetch(`${this.url}/${endpoint}`, {
                method,
                headers: defaultHeaders,
                body
            })

            const data = await response.json()

            if (!response.ok) {
                throw data
            }

            return data

        } catch (error) {
            throw error
        }
    }

    verify(email) {
        return this.request('verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
    }

    verifyCode(code) {
        return this.request('verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        })
    }
}
