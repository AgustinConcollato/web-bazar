import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { NavBar } from "../NavBar/NavBar";
import { UserMenu } from "../UserMenu/UserMenu";
import { Search } from "../Search/Search";
import './Header.css';

export function Header() {

    const { user } = useContext(AuthContext)

    return (
        <header>
            <div>
                <div>
                    <Link to={'/'}><img src="" alt="logo negocio" /></Link>
                    <NavBar />
                </div>
                <Search />
                {user ?
                    <div>
                        <Link to={'/pedido'}><FontAwesomeIcon icon={faBasketShopping} /></Link>
                        <UserMenu />
                    </div> :
                    <div>
                        <Link to={'/iniciar-sesion'} className="btn btn-regular">Ingresar</Link>
                        <Link to={'/registrarse'} className="btn btn-solid">Registrarse </Link>
                    </div>
                }
            </div>
        </header>
    )
}