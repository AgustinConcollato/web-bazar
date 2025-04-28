import { json } from 'react-router-dom';
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
            const response = await fetch(`${url}/register`, {
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

}