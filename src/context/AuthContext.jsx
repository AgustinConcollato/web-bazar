import React, { createContext, useEffect, useState } from "react"
import { api } from "../services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const { Auth } = api
    const auth = new Auth()

    const [client, setClient] = useState(null)


    async function register(data) {
        try {
            const response = await auth.register(data)

            const { token, client } = response
            localStorage.setItem('token', token)

            setClient(client)

            return client

        } catch (error) {
            throw error
        }
    }

    async function login(data) {
        try {
            const response = await auth.login(data)

            const { token, client } = response
            localStorage.setItem('token', token)

            setClient(client)
            setToken(token)

            return response
        } catch (error) {
            throw error
        }

    }

    async function logOut() {
        try {
            auth.logout()
            setClient(null)

        } catch (error) {
            throw error
        }
    }

    async function passwordReset(email) { }

    async function updatePhone(phone) {
        try {
            const client = await auth.updatePhone(phone)
            setClient(client)

            return client

        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        (async () => {
            const { client } = await auth.get()
            setClient(client)
        })()
    }, [])

    return <AuthContext.Provider value={{
        register,
        login,
        logOut,
        passwordReset,
        updatePhone,
        client
    }}>
        {children}
    </AuthContext.Provider>
}
