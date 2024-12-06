import { urlStorage } from "api-services";
import { Link } from "react-router-dom";
import { FormAddProductToCart } from "../FormAddProductToCart/FormAddProductToCart";
import './ProductCard.css';

export function ProductCard({ e }) {
    return (
        <>
            <div className='product-card'>
                <Link to={'/producto/' + e.id}>
                    <img loading="lazy" src={urlStorage + '/' + JSON.parse(e.images)[0]} alt={e.name + e.description} />
                    <div>
                        <p>{e.name}</p>
                        <p className='description'>{e.description}</p>
                    </div>
                    <span>${e.price}</span>
                </Link>
                <FormAddProductToCart type={'CARD'} product={e} />
            </div>
        </>
    )
}