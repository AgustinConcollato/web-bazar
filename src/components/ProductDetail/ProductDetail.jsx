import { urlStorage } from "api-services"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CategoriesContext } from "../../context/CategoriesContext"
import { FormAddProductToCart } from "../FormAddProductToCart/FormAddProductToCart"
import './ProductDetail.css'

export function ProductDetail({ product }) {

    const [images, setImages] = useState([])
    const [thumbnails, setThumbnail] = useState([])
    const [position, setPosition] = useState(0)

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
                        {thumbnails.map((e, i) =>
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
                            <h1>{product.name} <span>Código referencia: {product.code}</span></h1>
                            {product.description && <p className="description">{product.description}</p>}
                            <span>${product.price}</span>
                            <FormAddProductToCart type={'DETAIL'} product={product} />
                        </div>
                        <RecommendCategories product={product} />
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
            e.category_code == product.category_id &&
            <div className="recommend">
                <p>Ver mas productos relacionados:</p>
                <ul>
                    <li><Link to={'/productos/' + e.category_code}>{e.category_name}</Link></li>
                    {product.subcategory &&
                        e.subcategories.filter(sub => product.subcategory.includes(sub.subcategory_code)).map(sub =>
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