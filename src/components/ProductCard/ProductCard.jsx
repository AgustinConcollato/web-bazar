import { urlStorage } from "api-services";
import { Link } from "react-router-dom";
import { FormAddProductToCart } from "../FormAddProductToCart/FormAddProductToCart";
import './ProductCard.css';

export function ProductCard({ e }) {

    const isNewArrival = () => {
        const currentDate = new Date();
        const creationDate = new Date(e.creation_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);

        return creationDate >= thirtyDaysAgo;
    };

    return (
        <>
            <div className='product-card'>
                <Link to={'/producto/' + e.id}>
                    <img loading="lazy" src={urlStorage + '/' + JSON.parse(e.images)[0]} alt={e.name + e.description} />
                    <div>
                        <p>{e.name}</p>
                        <p className='description'>{e.description}</p>
                    </div>
                    {isNewArrival() && <span className="new-arrival">Nuevo Ingreso</span>}
                    {e.discount ?
                        <>
                            <p className="discount">
                                <span>-{e.discount}%</span>
                                <p className="price">${parseFloat(e.price)}</p>
                            </p>
                            <p>${parseFloat(e.price - (e.discount * e.price) / 100)}</p>
                        </> :
                        <p>${parseFloat(e.price)}</p>
                    }
                </Link>
                <FormAddProductToCart type={'CARD'} product={e} />
            </div>
        </>
    )
}