import { faBasketShopping, faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { NavBar } from "../NavBar/NavBar";
import { NavUser } from "../NavUser/NavUser";
import { Search } from "../Search/Search";
import './Header.css'

export function Header() {

    const { user } = useContext(AuthContext)

    return (
        <header>
            <div>
                <div>
                    <img src="" alt="logo negocio" />
                    <NavBar />
                </div>
                <Search />
                {user ?
                    <div>
                        <Link to={'/pedido'} className="btn"><FontAwesomeIcon icon={faBasketShopping} /></Link>
                        <div>
                            <button className="btn"><FontAwesomeIcon icon={faUser} /></button>
                            <NavUser />
                        </div>
                    </div> :
                    <div>
                        <Link to={'/iniciar-sesion'} className="btn btn-thins">Ingresar</Link>
                        <Link to={'/registrarse'} className="btn btn-solid">Registrarse </Link>
                    </div>
                }
            </div>
        </header>
    )
}