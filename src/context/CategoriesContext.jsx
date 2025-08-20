import { api } from "../services/api";
import { createContext, useEffect, useState } from "react";

export const CategoriesContext = createContext()

export function CategoriesProvider({ children }) {

    const { Categories } = api

    const [categories, setCategories] = useState(null)

    async function getCategories() {
        const categories = new Categories()

        const response = await categories.get({})

        setCategories(response.filter(e => e.code != 'CAT007'))
    }

    useEffect(() => {
        getCategories()
    }, [])


    return <CategoriesContext.Provider value={{ categories }}>{children}</CategoriesContext.Provider>
}