import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { api } from "../../services/api"
import './Filters.css'

export function Filters({ category }) {

    const { Categories, } = api
    const { subcategoryCode, categoryCode } = useParams()

    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState(null)
    const [hidden, setHidden] = useState(false)

    async function getCategories() {
        const categories = new Categories()

        const response = await categories.get({ code: category })

        setCategoryData(response)
        document.title = `${response.name}`
    }


    const handleChange = (e) => {
        const selectedSubcategory = e.target.value;
        navigate(`/productos/${categoryCode}/${selectedSubcategory}`);
    };

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
                    <h1>{categoryData.name}</h1>
                    <div>
                        {window.innerWidth <= 850 ?
                            <select value={subcategoryCode || ''} onChange={handleChange}>
                                <option value="" disabled hidden>Subcategoría</option>
                                {categoryData.subcategories.map((e) => (
                                    <option key={e.subcategory_code} value={e.subcategory_code}>
                                        {e.subcategory_name}
                                    </option>
                                ))}
                            </select> :
                            <p>Subcategorías</p>
                        }
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