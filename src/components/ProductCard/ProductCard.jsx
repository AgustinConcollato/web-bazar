import { urlStorage } from "api-services";
import { Link } from "react-router-dom";
import { FormAddProductToCart } from "../FormAddProductToCart/FormAddProductToCart";
import { useEffect, useState } from "react";
import './ProductCard.css';

export function ProductCard({ e }) {

    const [images, setImages] = useState([]);
    const [position, setPosition] = useState(0);
    const [fade, setFade] = useState(true);

    const isNewArrival = () => {
        const currentDate = new Date();
        const creationDate = new Date(e.creation_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);

        return creationDate >= thirtyDaysAgo;
    };

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setFade(false);
                setTimeout(() => {
                    setPosition((prev) => (prev + 1) % images.length);
                    setFade(true);
                }, 100);
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [images]);

    useEffect(() => {
        setImages(JSON.parse(e.images))
    }, [])

    return (
        <>
            <div className='product-card'>
                <Link to={'/producto/' + e.id}>
                    <div className="container-product-cart-images">
                        {images.length > 0 && (
                            <img
                                className={`fade-image ${fade ? "visible" : "hidden"}`}
                                loading="lazy"
                                src={urlStorage + '/' + images[position]}
                                alt={e.name + e.description}
                            />
                        )}
                    </div>
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