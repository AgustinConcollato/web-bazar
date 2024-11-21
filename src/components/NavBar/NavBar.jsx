import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "api-services"
import './NavBar.css'

export function NavBar() {

    const { Categories } = api

    const [categories, setCategories] = useState(null)
    const [hidden, setHidden] = useState(true)

    async function getCategories() {
        const categories = new Categories()
        setCategories(await categories.get({}))
    }

    document.onclick = (e) => {
        !e.target.closest('.btn') && setHidden(true)
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <div className="container-categories">
            <button className="btn" onClick={() => setHidden(!hidden)}>Categorías</button>
            {!hidden &&
                <nav>
                    <ul>
                        {(categories && categories.length != 0) &&
                            categories.map(e => <li><Link to={'productos/' + e.category_code}>{e.category_name}</Link></li>)}
                    </ul>
                </nav>}
        </div>
    )
}