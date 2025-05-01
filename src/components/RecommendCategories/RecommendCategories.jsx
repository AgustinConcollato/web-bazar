import { useContext } from "react"
import { Link } from "react-router-dom"
import { CategoriesContext } from "../../context/CategoriesContext"
import './RecommendCategories.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"

export function RecommendCategories({ product }) {
    const { categories } = useContext(CategoriesContext)

    return (
        (categories && categories.length != 0) &&
        categories.map(e =>
            e.code == product.category_code &&
            <div className="recommend">
                <button className="btn btn-solid" onClick={() => window.history.back()}><FontAwesomeIcon icon={faAngleLeft} /></button>
                <div>
                    <p>Categorias relacionadas a {product.name}</p>
                    <ul>
                        <li><Link to={'/productos/' + e.code}>{e.name}</Link></li>
                        {product.subcategory_code &&
                            e.subcategories.filter(sub => product.subcategory_code.includes(sub.subcategory_code)).map(sub =>
                                <li>
                                    <Link to={'/productos/' + sub.category_code + '/' + sub.subcategory_code}>
                                        {sub.subcategory_name}
                                    </Link>
                                </li>
                            )}
                    </ul>
                </div>
            </div>
        )
    )
}