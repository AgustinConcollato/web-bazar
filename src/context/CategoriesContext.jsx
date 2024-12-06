import { api } from "api-services";
import { createContext, useEffect, useState } from "react";

export const CategoriesContext = createContext()

export function CategoriesProvider({ children }) {

    const { Categories } = api

    const [categories, setCategories] = useState(null)

    async function getCategories() {
        const categories = new Categories()
        setCategories(await categories.get({}))
    }

    useEffect(() => {
        getCategories()
    }, [])


    return <CategoriesContext.Provider value={{ categories }}>{children}</CategoriesContext.Provider>
}