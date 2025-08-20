import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import img from '../../assets/img/no_photo.jpg'
import './UserMenu.css';

export function UserMenu() {

    const { logOut, client } = useContext(AuthContext)

    const [hidden, setHidden] = useState(true)
    const clientImage = img

    document.onclick = (e) => {
        (!e.target.closest('.btn-image') && !e.target.closest('.user-nav')) && setHidden(true)
    }

    return (
        <div className="container-user-nav">
            <img className="btn-image" src={clientImage} onClick={() => setHidden(!hidden)} alt="foto de perdil del usuario" />
            {!hidden &&
                <nav className="user-nav">
                    <div className="user-info">
                        <div>
                            <p>{client.name} <span>{client.type == 'final' ? 'Consumidor final' : 'Revendedor / Negocio'}</span></p>
                        </div>
                    </div>
                    <div className="div"></div>
                    <ul onClick={() => setHidden(!hidden)}>
                        <li><Link to={'/perfil'}>Mi Perfil</Link></li>
                        <li><Link to={'/compras'}>Mis pedidos</Link></li>
                    </ul>
                    <div className="div"></div>
                    <ul onClick={() => setHidden(!hidden)}>
                        <li><button onClick={logOut}>Cerrar sesión</button></li>
                    </ul>
                </nav>
            }
        </div>
    )
}