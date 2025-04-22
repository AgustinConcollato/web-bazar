import { urlStorage } from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CategoriesContext } from "../../context/CategoriesContext"
import { FormAddProductToCart } from "../FormAddProductToCart/FormAddProductToCart"
import './ProductDetail.css'

export function ProductDetail({ product }) {

    const [images, setImages] = useState([])
    const [thumbnails, setThumbnail] = useState([])
    const [position, setPosition] = useState(0)

    const isNewArrival = (e) => {
        const currentDate = new Date();
        const creationDate = new Date(e.creation_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);

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
        <section className="product-page">
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
                            {product.discount ?
                                <>
                                    <p className="discount">
                                        <span>-{product.discount}%</span>
                                        <p>${parseFloat(product.price)}</p>
                                    </p>
                                    <p className="price">${parseFloat(product.price - (product.discount * product.price) / 100)}</p>
                                </> :
                                <p className="price">${parseFloat(product.price)}</p>
                            }
                            <FormAddProductToCart type={'DETAIL'} product={product} />
                            <RecommendCategories product={product} />
                        </div>
                    </> :
                    <div className="product-inactive">
                        <p>Este producto no está disponible en este momento</p>
                        <RecommendCategories product={product} />
                    </div>
                }
            </div>
        </section>
    )
}


function RecommendCategories({ product }) {
    const { categories } = useContext(CategoriesContext)

    return (
        (categories && categories.length != 0) &&
        categories.map(e =>
            e.code == product.category_code &&
            <div className="recommend">
                <p>Ver mas productos relacionados</p>
                <ul>
                    <li><Link to={'/productos/' + e.code}>{e.name}</Link></li>
                    {product.subcategory_code &&
                        e.subcategories.filter(sub => product.subcategory_code.includes(sub.subcategory_code)).map(sub =>
                            <li>
                                <Link to={'/productos/' + sub.category_code + '/' + sub.subcategory_code}>
                                    {sub.subcategory_name}
                                </Link>
                            </li>
                        )}
                </ul>
            </div>
        )
    )
}