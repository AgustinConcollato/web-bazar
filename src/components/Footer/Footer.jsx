import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { CategoriesContext } from '../../context/CategoriesContext'
import { Modal } from '../Modal/Modal'
import { usePlatform } from '../../hooks/usePlatform'
import './Footer.css'

export function Footer() {

    const mobile = usePlatform()

    const { categories } = useContext(CategoriesContext)
    const { client, logOut } = useContext(AuthContext)

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
                        </ul>
                    </div>
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
                <p>Hecho por <Link to={'https://concosw.netlify.app'} target='_blank' rel='noopener noreferrer'>Conco Soluciones Web</Link> </p>
                {mobile ?
                    <Link to={'whatsapp://send?phone=+543492209855'} data-action="share/whatsapp/share" className='btn-whatsapp'><FontAwesomeIcon icon={faWhatsapp} size='2x' /></Link> :
                    <Link to={'https://web.whatsapp.com/send?phone=+543492209855'} target='_blank' rel='noopener noreferrer' className='btn-whatsapp'><FontAwesomeIcon icon={faWhatsapp} size='2x' /></Link>
                }
            </div>
            {modal &&
                <Modal onClose={setModal}>
                    {modal == 1 ?
                        <div className='terms-conditions'>
                            <h3>Compras y envios</h3>
                            <ul>
                                <li>Venta únicamente mayorista.</li>
                                <li>Envío a todo el país por transporte de preferencia. El costo del envío queda a cargo del cliente.</li>
                            </ul>
                        </div> :
                        modal == 2 ?
                            <div className='terms-conditions'>
                                <h3>Medios de pago</h3>
                                <ul>
                                    <li>Depósitos y transferencias.</li>
                                    <li>Efectivo.</li>
                                </ul>
                            </div> :
                            <div className='terms-conditions'>
                                <h3>Devoluciones</h3>
                                <ul>
                                    <li>Requisitos sobre el Estado del Producto</li>
                                    <ul>
                                        <li>El producto debe tener sus embalajes originales (incluyendo interiores) y encontrarse en perfectas condiciones.</li>
                                        <li>Debe estar completo, con todos sus accesorios, manuales y/o certificados correspondientes.</li>
                                        <li>En caso de cambio por falla, el producto debe haberse utilizado correctamente. No se aceptarán cambios si se constata mal uso del producto.</li>
                                    </ul>
                                    <li>Plazos</li>
                                    <ul>
                                        <li>El plazo para realizar reclamos, es de 72 hs recibido el pedido.</li>
                                    </ul>
                                </ul>
                            </div>
                    }
                </Modal>
            }
        </footer>
    )
}
