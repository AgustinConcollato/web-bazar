import { url, urlAddress } from "./api"

export class Address {
    constructor(userId) {
        this.userId = userId
        this.token = localStorage.getItem('token')
    }

    async add(address) {
        try {
            const response = await fetch(urlAddress, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(address)
            })

            if (!response.ok) {
                throw new Error('Error al agregar la dirección')
            }

            return await response.json()
        } catch (error) {
            throw new Error(error)
        }
    }

    async get() {
        try {
            const response = await fetch(`${urlAddress}/${this.userId}`)

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async save(address) {
        try {
            const response = await fetch(`${urlAddress}/${this.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: address.id })
            })

            if (!response.ok) {
                throw new Error('Error al guardar la dirección')
            }

            return await response.json()

        } catch (error) {
            throw new Error(error)
        }
    }

    async delete(id) {
        try {
            const response = await fetch(`${url}/address/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
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