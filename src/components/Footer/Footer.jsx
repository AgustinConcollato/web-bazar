import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { CategoriesContext } from '../../context/CategoriesContext'
import { usePlatform } from '../../hooks/usePlatform'
import { Modal } from '../Modal/Modal'
import './Footer.css'

export function Footer() {

    const mobile = usePlatform()

    const { categories } = useContext(CategoriesContext)
    const { client, logOut } = useContext(AuthContext)

    return (
        <footer>
            <div>
                <div className='container-footer'>
                    <div>
                        <Link to={'/'}><img src={client?.type === 'reseller' ? "/logo-c.svg" : "/logo-c-final.svg"} alt="logo bazarshop" /></Link>
                    </div>
                    <div className='container-footer-list'>
                        <div className='footer-list'>
                            <h4>Categorías</h4>
                            <ul>
                                {(categories && categories.length != 0) &&
                                    categories.map(e =>
                                        <li key={e.name}>
                                            <Link to={'/productos/' + e.code}>{e.name}</Link>
                                        </li>
                                    )}
                            </ul>
                        </div>
                        <div className='footer-list'>
                            <h4>Mi cuenta</h4>
                            {client ?
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
                </div>
                <p>Ver <Link to={'/terminos-condiciones'}>términos y condiciones</Link> de bazarshop</p>
                {mobile ?
                    <Link to={'whatsapp://send?phone=+543492209855'} data-action="share/whatsapp/share" className='btn-whatsapp'><FontAwesomeIcon icon={faWhatsapp} size='2x' /></Link> :
                    <Link to={'https://web.whatsapp.com/send?phone=+543492209855'} target='_blank' rel='noopener noreferrer' className='btn-whatsapp'><FontAwesomeIcon icon={faWhatsapp} size='2x' /></Link>
                }
            </div>
        </footer>
    )
}
