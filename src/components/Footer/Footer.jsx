import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { CategoriesContext } from '../../context/CategoriesContext'
import { Modal } from '../Modal/Modal'
import { usePlatform } from '../../hooks/usePlatform'
import './Footer.css'

export function Footer() {

    const mobile = usePlatform()

    const { categories } = useContext(CategoriesContext)
    const { user, logOut } = useContext(AuthContext)

    const [modal, setModal] = useState(null)

    return (
        <footer>
            <div>
                <div className='container-footer-list'>
                    <div className='footer-list'>
                        <h4>Términos y condiciones</h4>
                        <ul>
                            <li><button onClick={() => setModal(1)}>Compras y envios</button></li>
                            <li><button onClick={() => setModal(2)}>Medios de pago</button></li>
                            <li><button onClick={() => setModal(3)}>Devoluciones</button></li>
                            <li><button onClick={() => setModal(4)}>Cancelar pedido</button></li>
                        </ul>
                    </div>
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
                <p>Hecho por <Link to={'https://concosw.netlify.app'} target='_blank' data-action="share/whatsapp/share" rel='noopener noreferrer'>Conco Soluciones Web</Link> </p>
                {mobile ?
                    <Link to={'whatsapp://send?phone=+543492209855'} target='_blank' rel='noopener noreferrer' className='btn-whatsapp'><FontAwesomeIcon icon={faWhatsapp} size='2x' /></Link> :
                    <Link to={'https://web.whatsapp.com/send?phone=+543492209855'} target='_blank' rel='noopener noreferrer' className='btn-whatsapp'><FontAwesomeIcon icon={faWhatsapp} size='2x' /></Link>
                }
            </div>
            {modal &&
                <Modal onClose={setModal}>
                    {modal == 1 ?
                        <div>
                            <h3>Compras y envios</h3>
                            <p> Venta únicamente mayorista</p>
                            <p> Envío a todo el país por transporte de preferencia. El costo del envío queda a cargo del cliente.</p>
                        </div> :
                        modal == 2 ?
                            <div>
                                <h3>Medios de pago</h3>
                                <p>Depósitos y transferencias</p>
                                <p>Efectivo</p>
                            </div> :
                            modal == 3 ?
                                <div>3</div> :
                                <div>4</div>
                    }
                </Modal>
            }
        </footer>
    )
}
