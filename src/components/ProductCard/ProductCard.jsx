import { urlStorage } from "api-services";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import './ProductCard.css'

export function ProductCard({ e }) {
    return (
        <div className='productCard'>
            <Link to={'/producto/' + e.id}>
                <img src={urlStorage + '/' + JSON.parse(e.images)[0]} alt="" />
                <div>
                    <p>{e.name}</p>
                    <p className='description'>{e.description}</p>
                </div>
                <span>${e.price}</span>
            </Link>
            <form>
                <input type="number" name="quantity" min={1} className="input" placeholder='Cantidad' />
                <div>
                    <button type='submit' className="btn btn-regular"><FontAwesomeIcon icon={faBasketShopping} /></button>
                    <span>Agregar al pedido</span>
                </div>
            </form>
        </div>
    )
}