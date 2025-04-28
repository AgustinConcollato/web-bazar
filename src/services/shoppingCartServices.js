import { urlShoppingCart } from './api'

export class ShoppingCart {
    constructor(parameters) { }

    async add(data) {

        const response = await fetch(urlShoppingCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return await response.json()
    }

    async update(data) {

        const response = await fetch(urlShoppingCart, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return await response.json()
    }

    async get(clientId) {

        const response = await fetch(`${urlShoppingCart}/${clientId}`)

        return await response.json()
    }

    async getDetail(clientId) {

        const response = await fetch(`${urlShoppingCart}/detail/${clientId}`)

        return await response.json()
    }

    async delete({ clientId, productId }) {

        const response = await fetch(`${urlShoppingCart}/${clientId}/${productId}`, {
            method: 'DELETE'
        })

        return await response.json()
    }

    async confirm(data) {

        const response = await fetch(`${urlShoppingCart}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error()
        }

        const { order_id } = await response.json()
        return order_id
    }
}