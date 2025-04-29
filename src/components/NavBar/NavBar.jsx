import { useContext } from "react"
import { CategoriesContext } from "../../context/CategoriesContext"
import { NavLink } from "react-router-dom"
import './NavBar.css'

export function NavBar() {
    const { categories } = useContext(CategoriesContext)

    return (
        <nav className="nav-bar">
            <ul>
                {(categories && categories.length != 0) &&
                    categories.map(e =>
                        <li key={e.code}>
                            <NavLink to={'/productos/' + e.code}>{e.name}</NavLink>
                        </li>
                    )}
            </ul>
        </nav>
    )
}