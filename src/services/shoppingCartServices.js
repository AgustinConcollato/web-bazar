import { urlShoppingCart as url } from './api'

export class ShoppingCart {
    constructor() {
        this.token = localStorage.getItem('token')
        this.url = new URL(url)
    }

    async add(data) {
        try {
            const response = await fetch(url, {
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

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async update(data) {

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(data)
        })

        return await response.json()
    }

    async get() {
        try {
            const response = await fetch(`${url}/detail`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
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

    async getCount() {
        try {
            const response = await fetch(`${url}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
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


    async delete({ productId }) {

        try {

            const response = await fetch(`${url}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
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

    async confirm(data) {
        try {
            const response = await fetch(`${url}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            const { order_id } = await response.json()
            return order_id
        } catch (error) {
            throw error
        }
    }
}