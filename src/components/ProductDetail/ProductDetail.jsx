import { useEffect, useState } from "react"
import { urlStorage } from "../../services/api"
import { FormAddProductToCart } from "../FormAddProductToCart/FormAddProductToCart"
import './ProductDetail.css'

export function ProductDetail({ product }) {

    const [images, setImages] = useState([])
    const [thumbnails, setThumbnail] = useState([])
    const [position, setPosition] = useState(0)

    const isNewArrival = (e) => {
        const currentDate = new Date();
        const creationDate = new Date(e.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 10);

        return creationDate >= thirtyDaysAgo;
    };

    useEffect(() => {
        const images = JSON.parse(product.images)
        const thumbnails = JSON.parse(product.thumbnails)

        setImages(images)
        setThumbnail(thumbnails)

    }, [product.id])

    useEffect(() => {
        document.title = product?.name || 'Bazar Shop'
    }, [product])

    return (
        <div>
            <div className="product-detail" >
                <div className="container-images">
                    <img src={urlStorage + '/' + images[position]} alt={product.name} />
                    <div className="container-thumbnails">
                        {thumbnails.length > 1 &&
                            thumbnails.map((e, i) =>
                                <img
                                    src={urlStorage + '/' + e}
                                    key={i}
                                    onClick={() => setPosition(i)}
                                    className={position == i ? "thumbnail-selected" : ""}
                                />
                            )}
                    </div>
                </div>
                {product.status == 'active' ?
                    <>
                        <div className="container-product-info">
                            {isNewArrival(product) && <span className="new-arrival">Nuevo Ingreso</span>}
                            <h1>{product.name} <span>Código referencia: {product.code}</span></h1>
                            {product.description && <pre className="description">{product.description}</pre>}
                            {product.campaign_discount ? (
                                <>
                                    <p className="discount">
                                        <span>-{product.campaign_discount.type === "percentage" ? `${product.campaign_discount.value}%` : `$${product.campaign_discount.value}`}</span>
                                        <p>${parseFloat(product.price)}</p>
                                    </p>
                                    <p className="price">{product.campaign_discount.type === "percentage"
                                        ? `$${(product.price - (product.campaign_discount.value * product.price) / 100).toFixed(2)}`
                                        : `$${Math.max(0, product.price - product.campaign_discount.value).toFixed(2)}`
                                    }</p>
                                </>
                            ) : product.discount ? (
                                <>
                                    <p className="discount">
                                        <span>-{product.discount}%</span>
                                        <p>${parseFloat(product.price)}</p>
                                    </p>
                                    <p className="price">${(product.price - (product.discount * product.price) / 100).toFixed(2)}</p>
                                </>
                            ) : (
                                <p className="price">${parseFloat(product.price)}</p>
                            )}
                            <span className="stock">{product.available_quantity > 0 ? 'Disponibles: ' + product.available_quantity : 'Sin stock'}</span>
                            <FormAddProductToCart type={'DETAIL'} product={product} />
                        </div>
                    </> :
                    <div className="product-inactive">
                        <p>Este producto no está disponible en este momento</p>
                    </div>
                }
            </div>
        </div>
    )
}