import { api } from "api-services"
import { useEffect, useState } from "react"
import './Filters.css'
import { Link, useParams } from "react-router-dom"

export function Filters({ category }) {

    const { Categories, } = api
    const { subcategoryCode, categoryCode } = useParams()

    const [categoryData, setCategoryData] = useState(null)

    async function getCategories() {
        const categories = new Categories()

        const response = await categories.get({ code: category })

        setCategoryData(response)
        document.title = `Productos de ${response.category_name}`
    }

    useEffect(() => {

        getCategories()
    }, [category])

    return (
        <aside className="filters">
            {categoryData &&
                <>
                    <h1>{categoryData.category_name}</h1>
                    <div>
                        <p>Subcategorías </p>
                        {subcategoryCode && <Link to={'/productos/' + categoryCode} className="btn btn-error-thins" >Borrar filtro</Link>}
                    </div>
                    <ul>
                        {categoryData.subcategories.map((e) =>
                            <li key={e.subcategory_code}>
                                <Link
                                    to={'/productos/' + categoryCode + '/' + e.subcategory_code}
                                    className={subcategoryCode == e.subcategory_code ? 'subcategorySelected' : ''}
                                >
                                    {e.subcategory_name}
                                </Link>
                            </li>
                        )}
                    </ul>
                </>
            }
        </aside >
    )
}