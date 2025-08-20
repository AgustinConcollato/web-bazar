import { api } from "../services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";

export const CartContext = createContext()

export function CartProvider({ children }) {

    const { client } = useContext(AuthContext)

    const { ShoppingCart } = api
    const shoppingCart = new ShoppingCart()

    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0)

    async function getCart() {
        const response = await shoppingCart.get()
        setCart(response)

        return response
    }

    async function getCartCount() {
        const response = await shoppingCart.getCount()
        setCartCount(response)

    }

    async function addProductCart(product) {
        try {
            const response = await shoppingCart.add(product)

            setCart(prevCart => {
                if (!prevCart) return [response]
                const existingItem = prevCart.find(item => item.product_id === product.product_id)
                if (existingItem) {
                    return prevCart.map(item =>
                        item.product_id === product.product_id
                            ? { ...item, quantity: parseInt(item.quantity) + parseInt(product.quantity) }
                            : item
                    )
                }
                return [...prevCart, response]
            })

            return response
        } catch (error) {
            throw error
        }
    }

    async function deleteProductCart(data) {
        try {
            const response = await shoppingCart.delete(data)

            setCart(prevCart => prevCart.filter(item => item.product_id !== response.product_id))

            return response
        } catch (error) {
            throw error
        }
    }

    async function updateProductCart(data) {
        const response = await shoppingCart.update(data)

        setCart(prevCart =>
            prevCart.map(item =>
                item.product_id === data.product_id ? { ...item, quantity: data.quantity } : item
            )
        )

        return response
    }

    async function confirmCart(data) {
        const response = await shoppingCart.confirm(data)
        setCart([])

        return response
    }

    useEffect(() => {
        client && getCartCount()
    }, [client])

    useEffect(() => {
        setCartCount(cart ? cart.length : 0)
    }, [cart])

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            addProductCart,
            deleteProductCart,
            updateProductCart,
            confirmCart,
            getCart
        }}> {children} </CartContext.Provider>
    )
}