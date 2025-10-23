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
    const { cartCount } = useContext(CartContext)

    const [quantity, setQuantity] = useState(0)
    const [width, setWidth] = useState(window.innerWidth)
    const [currentMsg, setCurrentMsg] = useState(0);

    const messages = [
        "Compra mínima por la web $100.000",
        "5% de descuento para compras superiores a $300.000"
    ];

    const handleResize = () => {
        setWidth(window.innerWidth)
    }

    document.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    useEffect(() => {
        setQuantity(cartCount)
    }, [cartCount])

    useEffect(() => {
        if (width < 660 && client?.type === 'reseller') {
            const interval = setInterval(() => {
                setCurrentMsg(prev => (prev + 1) % messages.length);
            }, 3000); // Cambia cada 3 segundos
            return () => clearInterval(interval);
        }
    }, [width, client]);

    return (
        <>
            {client?.type === 'reseller' && (
                width < 660 ?
                    <div className="min-purchase-slider">
                        <p className="min-purchase">{messages[currentMsg]}</p>
                    </div>
                    :
                    <p className="min-purchase">
                        {messages.join(' | ')}
                    </p>
            )}
            <header>
                <div className="header-container">
                    <div>
                        <Link to={'/'} className="logo">
                            <img className="desktop" src={"/logo-final.svg"} alt="Logo bazarshop mayorista" />
                            <img className="mobile" src="/vite.svg" alt="Logo bazarshop mayorista" />
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