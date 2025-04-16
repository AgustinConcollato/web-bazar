import { useSearchParams } from "react-router-dom";
import "./ProductFilters.css";

export function ProductFilters({ totalProducts }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterChange = (filter, value, isSorting = false) => {
        const newParams = new URLSearchParams(searchParams); // Copia de los parámetros

        if (!isSorting) {
            newParams.delete('page')
        }


        if (value) {
            newParams.set(filter, value);
        } else {
            newParams.delete(filter);
        }

        setSearchParams(newParams); // Actualiza la URL con los nuevos filtros
    };

    return (
        <div className="container-filters">
            <p>{totalProducts || '0'} productos encontrados</p>

            <div className="filter">
                <select
                    className="input"
                    onChange={(e) => { handleFilterChange('price', e.target.value, true) }}
                >
                    <option value="">Ordenar</option>
                    <option value="min">Menor precio</option>
                    <option value="max">Mayor precio</option>
                </select>
            </div>
        </div>
    );
}
