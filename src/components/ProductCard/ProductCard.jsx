import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { urlStorage } from "../../services/api";
import { FormAddProductToCart } from "../FormAddProductToCart/FormAddProductToCart";
import './ProductCard.css';

export function ProductCard({ e }) {

    const [images, setImages] = useState([]);
    const [position, setPosition] = useState(0);
    const [fade, setFade] = useState(true);

    const isNewArrival = () => {
        const currentDate = new Date();
        const creationDate = new Date(e.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 10);

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
                        {(images.length > 1 && position > 0) && (
                            <button
                                className="image-nav prev"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPosition((prev) => (prev - 1 + images.length) % images.length);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>
                        )}
                        {images.length > 0 && (
                            <img
                                className={`fade-image ${fade ? "visible" : "hidden"}`}
                                loading="lazy"
                                src={'https://api.bazarrshop.com/storage' + '/' + images[position]}
                                // src={urlStorage + '/' + images[position]}
                                alt={e.name + e.description}
                            />
                        )}
                        {(images.length > 1 && position < images.length - 1) && (
                            <button
                                className="image-nav next"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPosition((prev) => (prev + 1) % images.length);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleRight} />
                            </button>
                        )}
                        {e.available_quantity <= 0 && <span className="stock">Sin stock</span>}
                    </div>
                    <div>
                        <p>{e.name}</p>
                        <p className='description'>{e.description}</p>
                    </div>
                    {isNewArrival() && <span className="new-arrival">Nuevo Ingreso</span>}
                    {e.campaign_discount ? (
                        <>
                            <p className="discount">
                                <span>
                                    <span style={e.campaign_discount.value < 10 ? { left: '-5px' } : {}}>-{e.campaign_discount.type === "percentage" ? `${e.campaign_discount.value}%` : `$${e.campaign_discount.value}`}</span>
                                </span>
                                <p className="price">${parseFloat(e.price)}</p>
                            </p>
                            <p>${e.campaign_discount.type === "percentage"
                                ? (e.price - (e.campaign_discount.value * e.price) / 100).toLocaleString('es-AR', { maximumFractionDigits: 2 })
                                : Math.max(0, e.price - e.campaign_discount.value).toLocaleString('es-AR', { maximumFractionDigits: 2 })
                            }</p>
                        </>
                    ) : e.discount ? (
                        <>
                            <p className="discount">
                                <span>
                                    <span style={e.discount < 10 ? { left: '-5px' } : {}} >-{e.discount}%</span>
                                </span>
                                <p className="price">${parseFloat(e.price).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                            </p>
                            <p>${(e.price - (e.discount * e.price) / 100).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                        </>
                    ) : (
                        <p className="price">${parseFloat(e.price).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                    )}
                </Link>
                <FormAddProductToCart type={'CARD'} product={e} />
            </div>
        </>
    )
}