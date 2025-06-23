import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { CartContext } from "../../context/CartContext";
import { NavBar } from "../NavBar/NavBar";
import { BtnNavBar } from "../BtnNavBar/BtnNavBar";
import { Search } from "../Search/Search";
import { UserMenu } from "../UserMenu/UserMenu";
import './Header.css';

export function Header() {

    const { client } = useContext(AuthContext)
    const { cart } = useContext(CartContext)

    const [quantity, setQuantity] = useState(0)
    const [width, setWidth] = useState(window.innerWidth)

    const handleResize = () => {
        setWidth(window.innerWidth)
    }

    document.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    useEffect(() => {
        cart && setQuantity(cart.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.quantity), 0))
    }, [cart])

    return (
        <>
            <p className="min-purchase">Compra mínima por la web $150.000</p>
            <header>
                <div className="header-container">
                    <div>
                        <Link to={'/'} className="logo">
                            <img src="/logo.svg" alt="Logo bazarshop mayorista" />
                        </Link>
                        <Search />
                        {client ?
                            <div className="btns-header">
                                <Link className="btn btn-order" to={'/pedido'}>
                                    {quantity != 0 && <span>{quantity}</span>}
                                    <FontAwesomeIcon icon={faBasketShopping} />
                                </Link>
                                <UserMenu />
                            </div> :
                            <div className="btns-header">
                                <Link to={'/iniciar-sesion'} className="btn btn-regular">Ingresar</Link>
                                <Link to={'/registrarse'} className="btn btn-solid">Registrarse </Link>
                            </div>
                        }
                    </div>
                    {width >= 800 ?
                        <NavBar /> :
                        <BtnNavBar />
                    }
                </div>
            </header>
        </>
    )
}