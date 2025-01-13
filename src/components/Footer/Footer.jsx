import { useContext } from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import { CategoriesContext } from '../../context/CategoriesContext'
import { AuthContext } from '../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export function Footer() {

    const { categories } = useContext(CategoriesContext)
    const { user, logOut } = useContext(AuthContext)

    return (
        <footer>
            <div>
                <div className='container-footer-list'>
                    <div className='footer-list'>
                        <h4>Categorías</h4>
                        <ul>
                            {(categories && categories.length != 0) &&
                                categories.map(e =>
                                    <li key={e.category_name}>
                                        <Link to={'/productos/' + e.category_code}>{e.category_name}</Link>
                                    </li>
                                )}
                        </ul>
                    </div>
                    <div className='footer-list'>
                        <h4>Mi cuenta</h4>
                        {user ?
                            <ul>
                                <li><Link to={'/perfil'}>Mi perfil</Link></li>
                                <li><Link to={'/compras'}>Mis pedidos</Link></li>
                                <li><button onClick={logOut}>Cerrar sesión</button></li>
                            </ul> :
                            <ul>
                                <li><Link to={'/iniciar-sesion'}>Ingresar</Link></li>
                                <li><Link to={'/registrarse'}>Registrarse</Link></li>
                            </ul>
                        }
                    </div>
                </div>
                <div>
                    <button className='btn'>Términos y condiciones</button>
                    <button className='btn'>Medios de pago</button>
                    <button className='btn'>Cancelar pedido</button>
                </div>
                <Link to={'/'} className='btn-whatsapp'><FontAwesomeIcon icon={faWhatsapp} size='2x' /></Link>
            </div>
        </footer>
    )
}
