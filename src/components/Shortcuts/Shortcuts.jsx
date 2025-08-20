import { useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/authContext"
import { CartContext } from "../../context/CartContext"
import { urlStorage } from "../../services/api"
import { Modal } from "../Modal/Modal"
import { NewAddress } from "../NewAddress/NewAddress"
import './Shortcuts.css'

export function Shortcuts() {

    const { client } = useContext(AuthContext)
    const { cart } = useContext(CartContext)

    const intervalRef = useRef();

    const [imgIndex, setImgIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [changeAddress, setChangeAddress] = useState(false)
    const [addresses, setAddresses] = useState([])
    const [seeBenefit, setSeeBenefit] = useState(false)

    useEffect(() => {
        if (cart && cart.length > 1) {
            intervalRef.current = setInterval(() => {
                setFade(false); // Oculta la imagen actual
                setTimeout(() => {
                    setImgIndex(prev => (prev + 1) % cart.length);
                    setFade(true); // Muestra la nueva imagen
                }, 200); // Duración del fade out (en ms)
            }, 2500);

            return () => clearInterval(intervalRef.current);
        } else if (cart && cart.length === 1) {
            setImgIndex(0);
            setFade(true);
        }
    }, [cart]);

    useEffect(() => {
        if (client) {
            client.address = addresses
        }
    }, [addresses])

    return (
        <section className="section-shortcuts">
            <div className="shortcut-list">
                {!client &&
                    <Link to={'/iniciar-sesion'} className="shortcut">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" className="shortcut-icon" color="#000000" fill="none">
                                <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11 10C11 8.89543 10.1046 8 9 8C7.89543 8 7 8.89543 7 10C7 11.1046 7.89543 12 9 12C10.1046 12 11 11.1046 11 10Z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13 16C13 13.7909 11.2091 12 9 12C6.79086 12 5 13.7909 5 16" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15 9H19" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15 12H19" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div>
                                <span>Ingresá a tu cuenta</span>
                                <p>Armá y realizá tus pedido de los productos que más te gustan</p>
                            </div>
                        </div>
                        <button className="btn btn-solid">Ingresar a tu cuenta</button>
                    </Link>
                }
                {
                    client && client.address?.length == 0 &&
                    <div className="shortcut" onClick={() => setChangeAddress(true)}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="42" className="shortcut-icon" color="#000000" fill="none">
                                <path d="M14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9Z" stroke="#000000" stroke-width="1"></path>
                                <path d="M18.2222 17C19.6167 18.9885 20.2838 20.0475 19.8865 20.8999C19.8466 20.9854 19.7999 21.0679 19.7469 21.1467C19.1724 22 17.6875 22 14.7178 22H9.28223C6.31251 22 4.82765 22 4.25311 21.1467C4.20005 21.0679 4.15339 20.9854 4.11355 20.8999C3.71619 20.0475 4.38326 18.9885 5.77778 17" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M13.2574 17.4936C12.9201 17.8184 12.4693 18 12.0002 18C11.531 18 11.0802 17.8184 10.7429 17.4936C7.6543 14.5008 3.51519 11.1575 5.53371 6.30373C6.6251 3.67932 9.24494 2 12.0002 2C14.7554 2 17.3752 3.67933 18.4666 6.30373C20.4826 11.1514 16.3536 14.5111 13.2574 17.4936Z" stroke="#000000" stroke-width="1"></path>
                            </svg>
                            <div>
                                <span>Agregá una dirección</span>
                                <p>Indicá donde querés recibir tus pedidos</p>
                            </div>
                        </div>
                        <button className="btn btn-regular">Agregar dirección</button>
                    </div>
                }
                {client && client.type == "reseller" &&
                    <div className="shortcut" onClick={() => setSeeBenefit(true)}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="54" className="shortcut-icon" color="#000000" fill="none">
                                <path d="M2.46439 9.34375C2.21585 9.34375 1.98905 9.14229 2.00048 8.87895C2.06739 7.33687 2.25487 6.33298 2.78014 5.53884C3.08234 5.08196 3.45771 4.68459 3.88929 4.36468C5.05581 3.5 6.70145 3.5 9.99272 3.5H14.0074C17.2987 3.5 18.9443 3.5 20.1109 4.36468C20.5424 4.68459 20.9178 5.08196 21.22 5.53884C21.7452 6.33289 21.9327 7.33665 21.9996 8.87843C22.0111 9.14208 21.784 9.34375 21.5352 9.34375C20.1494 9.34375 19.026 10.533 19.026 12C19.026 13.467 20.1494 14.6562 21.5352 14.6562C21.784 14.6562 22.0111 14.8579 21.9996 15.1216C21.9327 16.6634 21.7452 17.6671 21.22 18.4612C20.9178 18.918 20.5424 19.3154 20.1109 19.6353C18.9443 20.5 17.2987 20.5 14.0074 20.5H9.99272C6.70145 20.5 5.05581 20.5 3.88929 19.6353C3.45771 19.3154 3.08234 18.918 2.78014 18.4612C2.25487 17.667 2.06739 16.6631 2.00048 15.1211C1.98905 14.8577 2.21585 14.6562 2.46439 14.6562C3.85018 14.6562 4.97358 13.467 4.97358 12C4.97358 10.533 3.85018 9.34375 2.46439 9.34375Z" stroke="#000000" stroke-width="1" stroke-linejoin="round"></path>
                                <path d="M9.50006 14.5L14.5001 9.5" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M9.50006 9.5H9.51129M14.4888 14.5H14.5001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <div>
                                <span>Beneficio</span>
                                <p>5% de descuento para compras superiores a $300.000</p>
                            </div>
                        </div>
                        <button className="btn btn-regular">Ver beneficio</button>
                    </div>
                }
                {(client && cart) && cart.length !== 0 &&
                    <Link to={'/pedido/confirmar'} className="shortcut">
                        <div>
                            <img
                                className={`${fade ? "img-visible" : "img-hidden"}`}
                                src={`${urlStorage}/${JSON.parse(cart[imgIndex].product.thumbnails)[0]}`}
                                alt={cart[imgIndex].product.name}
                            />
                            <div>
                                <span>Pedido pendiente</span>
                                <p>Tenés productos en tu carrito listos para confirmar</p>
                            </div>
                        </div>
                        <button className="btn btn-regular">Confirmar pedido</button>
                    </Link>
                }
            </div>
            {changeAddress &&
                <Modal onClose={setChangeAddress}>
                    <NewAddress
                        setAddresses={setAddresses}
                        onClose={setChangeAddress}
                        total={0}
                    />
                </Modal>
            }
            {seeBenefit &&
                <Modal onClose={setSeeBenefit}>
                    <div className="benefit">
                        <h4>Beneficio</h4>
                        <p>Obtené un 5% de descuento en compras superiores a $300.000</p>
                        <p>Este beneficio aplica únicamente para pagos en efectivo o transferencia. No válido para pagos con cheque.</p>
                        <p>El descuento aplica únicamente para pedidos cuyo total final sea igual o superior a $300.000. En caso de faltantes que reduzcan el monto, no se aplicará.</p>
                    </div>
                </Modal>
            }
        </section >
    )
}