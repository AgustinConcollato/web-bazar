import { api } from "api-services"
import { useEffect, useState } from "react"
import './Filters.css'
import { Link, useParams } from "react-router-dom"

export function Filters({ category }) {

    const { Categories, } = api
    const { subcategoryCode, categoryCode } = useParams()

    const [categoryData, setCategoryData] = useState(null)
    const [hidden, setHidden] = useState(false)

    async function getCategories() {
        const categories = new Categories()

        const response = await categories.get({ code: category })

        setCategoryData(response)
        document.title = `Productos de ${response.category_name}`
    }


    useEffect(() => {
        getCategories()

        const handleResize = () => {
            if (window.innerWidth > 850) setHidden(false);
            else setHidden(true);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [category])

    return (
        <aside className="filters">
            {categoryData &&
                <>
                    <h1>{categoryData.category_name}</h1>
                    <div>
                        <p onClick={() => setHidden(!hidden)}>Subcategorías </p>
                        {subcategoryCode && <Link to={'/productos/' + categoryCode} className="btn btn-error-thins" >Borrar filtro</Link>}
                    </div>
                    {!hidden &&
                        <ul onClick={() => setHidden(!hidden)}>
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
                    }
                </>
            }
        </aside >
    )
}