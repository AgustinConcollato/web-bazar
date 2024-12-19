import { useContext, useState } from "react";
import { InputCity } from "./InputCity";
import { InputStreet } from "./InputStreet";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import './NewAddress.css'
import { generateId } from "../../utils/generateId";

export function NewAddress({ setAddresses, total }) {

    const urlApiLocation = 'https://apis.datos.gob.ar/georef/api'

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const [provinceList, setProvinceList] = useState([])
    const [province, setProvince] = useState()
    const [city, setCity] = useState()
    const [address, setAddress] = useState()
    const [number, setNumber] = useState()

    async function getProvinces() {
        const response = await fetch(urlApiLocation + '/provincias')
        const { provincias } = await response.json()
        setProvinceList(provincias)
    }
    function selectProvince(e) {
        setProvince(e.target.value)
    }

    async function addAddress(e) {
        e.preventDefault()

        const response = await fetch('http://localhost:8000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.uid,
                province,
                city,
                address,
                address_number: number,
                status: total == 0 ? 'selected' : null,
                code: generateId()
            })
        })

        const addressCreated = await response.json()

        if (addressCreated) {
            setAddresses(e => [...e, addressCreated])
            navigate('/perfil')
        }
    }

    return (
        <>
            <Link to={'/perfil'}>Cerrar</Link>
            <form onSubmit={addAddress}>
                <select name="province" onFocus={getProvinces} onChange={selectProvince}>
                    <option value="">Selecciona una provincia</option>
                    {provinceList.map(e => <option key={e.id} value={e.nombre}>{e.nombre}</option>)}
                </select>
                {province && <InputCity url={urlApiLocation} province={province} setCity={setCity} />}
                {city &&
                    <div>
                        <InputStreet
                            url={urlApiLocation}
                            setAddress={setAddress}
                            province={province}
                            city={city}
                        />
                        <input
                            type="text"
                            placeholder="Altura"
                            onChange={({ target }) => setNumber(target.value)}
                            className="input"
                        />
                    </div>}
                {(province && city && address && number) &&
                    <button type="submit" className="btn btn-solid">Agregar</button>
                }
            </form>
        </>
    )
}