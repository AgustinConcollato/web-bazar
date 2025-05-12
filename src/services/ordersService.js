import { urlOrder as url } from "./api";

export class Order {
    constructor() {
        this.token = localStorage.getItem('token')
    }

    // async create({ data }) {
    //     const response = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': `Bearer ${this.token}`
    //         },
    //         body: data
    //     })

    //     if (!response.ok) {
    //         const errorData = await response.json();
    //         throw new Error(JSON.stringify(errorData));
    //     }

    //     return await response.json()
    // }

    // async pending(id = null) {

    //     if (id) {
    //         const response = await fetch(`${url}/pending/${id}`)

    //         return await response.json()
    //     }

    //     const response = await fetch(`${url}/pending`, {
    //         headers: {
    //             'Authorization': `Bearer ${this.token}`
    //         }
    //     })

    //     return await response.json()
    // }

    // async accepted(id = null) {
    //     try {

    //         if (id) {
    //             const response = await fetch(`${url}/accepted/${id}`)

    //             if (!response.ok) {
    //                 const error = await response.json()
    //                 throw error
    //             }

    //             return await response.json()
    //         }

    //         const response = await fetch(`${url}/accepted`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${this.token}`
    //             }
    //         })

    //         if (!response.ok) {
    //             const error = await response.json()
    //             throw error
    //         }

    //         return await response.json()

    //     } catch (error) {

    //     }
    // }

    // async rejectOrder(id) {
    //     try {
    //         const response = await fetch(`${url}/reject/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Authorization': `Bearer ${this.token}`
    //             }
    //         })

    //         if (!response.ok) {
    //             const error = await response.json()
    //             throw error
    //         }

    //         return await response.json()
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // async acceptOrder(id) {
    //     try {
    //         const response = await fetch(`${url}/accept/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Authorization': `Bearer ${this.token}`
    //             }
    //         })

    //         if (!response.ok) {
    //             const error = await response.json()
    //             throw error
    //         }

    //         return await response.json()
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // async completed({ clientId, year, month }) {
    //     let urlRequest = `${url}/completed`;

    //     if (clientId) {
    //         urlRequest += `/${clientId}`;
    //     }

    //     // Construimos los parámetros de la URL
    //     const params = new URLSearchParams();
    //     params.append("year", year);

    //     if (month !== undefined && month !== "all") {
    //         params.append("month", month);
    //     }

    //     // Concatenamos los parámetros solo si existen
    //     const fullUrl = `${urlRequest}?${params.toString()}`;
    //     const response = await fetch(fullUrl);

    //     return await response.json();
    // }

    async get({ status, clientId, year, month, page }) {

        // Construimos los parámetros de la URL
        const params = new URLSearchParams();
        
        params.append("page", page);

        if (status) {
            params.append("status", status);
        }

        if (year) {
            params.append("year", year);
        }

        if (clientId) {
            params.append("client_id", clientId);
        }

        if (month !== undefined && month !== "all") {
            params.append("month", month);
        }

        // Concatenamos los parámetros solo si existen
        const fullUrl = `${url}/client?${params.toString()}`;
        const response = await fetch(fullUrl, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })

        return await response.json()
    }


    async detail(id) {
        try {
            const response = await fetch(`${url}/detail/${id}`)

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async add(data) {
        try {
            const response = await fetch(`${url}/product/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
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

    async remove(data) {
        try {
            const response = await fetch(`${url}/product/remove`, {
                method: 'DELETE',
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

    async delete(id) {
        try {
            const response = await fetch(`${url}/cancel/${id}`, {
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

    async complete(id) {
        try {
            const response = await fetch(`${url}/complete/${id}`, {
                method: 'PUT',
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

    async update(data) {
        try {
            const response = await fetch(`${url}/product`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
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

    async remit(orderData) {
        let date

        if (orderData.status == 'pending') {
            date = new Date().getTime()
        } else {
            date = orderData.date
        }

        try {
            const response = await fetch(`${url}/pdf/${orderData.id}?date=${date}`)
            const data = await response.blob()
            const pdfUrl = URL.createObjectURL(data);
            return pdfUrl
        } catch (error) {
            throw new Error(error)
        }
    }
}