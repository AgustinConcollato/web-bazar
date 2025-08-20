import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./ProductFilters.css";

export function ProductFilters({ totalProducts, setAvailableQuantity, availableQuantity }) {

    const { client } = useContext(AuthContext);

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
            <div className="show-not-available-quantity">
                <div className="filter">
                    <select
                        className="input"
                        value={searchParams.get('price') ?? ''}
                        onChange={(e) => { handleFilterChange('price', e.target.value, true) }}
                    >
                        <option value="">Ordenar</option>
                        <option value="min">Menor precio</option>
                        <option value="max">Mayor precio</option>
                    </select>
                </div>
                {client?.type == "reseller" &&
                    <p onClick={() => setAvailableQuantity(e => e ? null : true)}>
                        Ver productos con stock
                        <div className={availableQuantity ? 'true' : 'false'}>
                            <div className="circle"></div>
                        </div>
                    </p>
                }
            </div>
            <p>{totalProducts || '0'} productos encontrados</p>

        </div>
    );
}
