import { api } from "api-services"
import { useEffect, useState } from "react"
import './Filters.css'
import { Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons"

export function Filters({ category }) {

    const { Categories, } = api
    const { subcategoryCode, categoryCode } = useParams()

    const [categoryData, setCategoryData] = useState(null)
    const [hidden, setHidden] = useState(false)

    async function getCategories() {
        const categories = new Categories()

        const response = await categories.get({ code: category })

        setCategoryData(response)
        document.title = `${response.category_name}`
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

    useEffect(() => {
        if (categoryData && subcategoryCode) {
            const subcategory = categoryData.subcategories.find(e => e.subcategory_code === subcategoryCode)
            const oldTitle = document.title.split(' - ')[0]
            document.title = oldTitle
            if (subcategory) document.title += ` - ${subcategory.subcategory_name}`
        }

        window.innerWidth <= 850 && setHidden(true)
    }, [subcategoryCode])

    return (
        <aside className="filters">
            {categoryData &&
                <>
                    <h1>{categoryData.category_name}</h1>
                    <div>
                        <p onClick={() => setHidden(window.innerWidth <= 850 && !hidden)}>Subcategorías {window.innerWidth <= 850 && <FontAwesomeIcon icon={!hidden ? faAngleUp : faAngleDown} />}</p>
                        {subcategoryCode && <Link to={'/productos/' + categoryCode} className="btn btn-error-thins" >Borrar filtro</Link>}
                    </div>
                    {!hidden &&
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
                    }
                </>
            }
        </aside >
    )
}