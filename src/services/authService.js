import { urlClients as url } from './api'

export class Auth {
    constructor() {
        this.token = localStorage.getItem('token')
    }

    async get() {
        try {
            const response = await fetch(`${url}/auth`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async register(data) {
        try {
            const response = await fetch(`${url}/register/web`, {
                method: 'POST',
                body: data
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async login(data) {
        try {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                body: data
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async logout() {
        const response = await fetch(`${url}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            }
        })

        return await response.json()
    }

    async updatePhone(phone) {
        try {
            const response = await fetch(`${url}/update/phone`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(phone),
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async updateEmail(email) {
        try {
            const response = await fetch(`${url}/update/email`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email)
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async passwordReset(data) {
        try {

            const response = await fetch(`${url}/reset-password`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: data
            });


            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }
}