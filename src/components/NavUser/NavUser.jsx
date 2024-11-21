import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export function NavUser() {

    const { logOut } = useContext(AuthContext)

    return (
        <nav>
            <ul>
                <li><Link to={'/compras'}>Compras</Link></li>
                <li><button onClick={logOut}>Cerrar sesión</button></li>
            </ul>
        </nav>
    )
}