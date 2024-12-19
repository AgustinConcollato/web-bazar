import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CategoriesContext } from "../../context/CategoriesContext";
import './NavBar.css';

export function NavBar() {

    const { categories } = useContext(CategoriesContext)

    const [hidden, setHidden] = useState(true)

    document.onclick = (e) => {
        !e.target.closest('.btn') && setHidden(true)
    }

    return (
        <div className="container-categories">
            <button className="btn" onClick={() => setHidden(!hidden)}>Categorías</button>
            {!hidden &&
                <nav>
                    <ul>
                        {(categories && categories.length != 0) &&
                            categories.map(e =>
                                <li key={e.category_code} onClick={() => setHidden(!hidden)}>
                                    <Link to={'/productos/' + e.category_code}>{e.category_name}</Link>
                                </li>
                            )}
                    </ul>
                </nav>}
        </div>
    )
}