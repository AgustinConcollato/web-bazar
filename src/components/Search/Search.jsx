import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchInput } from "../SearchInput/SearchInput";
import './Search.css'
import { useNavigate } from "react-router-dom";

export function Search() {

    const navigate = useNavigate()

    async function searchProduct(e) {
        e.preventDefault()
        navigate('buscador/' + e.target[0].value)
    }

    return (
        <form onSubmit={searchProduct} className="search">
            <SearchInput />
            <button type="button"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </form>
    )
}