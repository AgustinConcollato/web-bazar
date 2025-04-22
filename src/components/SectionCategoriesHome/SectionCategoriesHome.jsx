import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../Loading/Loading";
import { CategoriesContext } from "../../context/CategoriesContext";
import icon1 from '../../assets/img/icon1.png';
import icon2 from '../../assets/img/icon2.png';
import icon3 from '../../assets/img/icon3.png';
import icon4 from '../../assets/img/icon4.png';
import icon5 from '../../assets/img/icon5.png';
import icon6 from '../../assets/img/icon6.png';
import icon7 from '../../assets/img/icon7.png';
import './SectionCategoriesHome.css';

export function SectionCategoriesHome() {

    const icons = [icon1, icon2, icon3, icon4, icon5, icon6, icon7]

    const { categories: categoryList } = useContext(CategoriesContext)

    const [categories, setCategories] = useState(null);

    useEffect(() => {
        categoryList && setCategories(categoryList)
    }, [categoryList])

    return (
        <section className="section-categories-home">
            <h2>Categorías</h2>
            {categories ?
                categories.map((e, i) =>
                    <Link key={e.code} to={`/productos/${e.code}`} className="div-cateogry">
                        <div>
                            <p>{e.name}</p>
                            <img src={icons[i]} alt={"icono de la categoría " + e.name} />
                        </div>
                    </Link>
                ) :
                <Loading />
            }
        </section>
    )
}