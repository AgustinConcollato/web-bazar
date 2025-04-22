import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { NavBar } from "../NavBar/NavBar";
import { UserMenu } from "../UserMenu/UserMenu";
import { Search } from "../Search/Search";
import './Header.css';
import { CartContext } from "../../context/CartContext";

export function Header() {

    const { user } = useContext(AuthContext)
    const { cart } = useContext(CartContext)

    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        cart && setQuantity(cart.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.quantity), 0))
    }, [cart])

    return (
        <header>
            <div>
                <div>
                    <Link to={'/'}><h1><span>BAZAR</span>SHOP</h1></Link>
                    <NavBar />
                </div>
                <Search />
                {user ?
                    <div>
                        <Link className="btn-order" to={'/pedido'}>
                            {quantity != 0 && <span>{quantity}</span>}
                            <FontAwesomeIcon icon={faBasketShopping} />
                        </Link>
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