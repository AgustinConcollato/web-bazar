import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { generateId } from "../../utils/generateId";
import { InputCity } from "./InputCity";
import { InputStreet } from "./InputStreet";
import './NewAddress.css';
import { Address } from "api-services/addressService";

export function NewAddress({ setAddresses, total, onClose }) {

    const urlApiLocation = 'https://apis.datos.gob.ar/georef/api'

    const { user } = useContext(AuthContext)

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

        const address = new Address(user.uid)

        try {
            const addressCreated = await address.add({
                user_id: user.uid,
                province,
                city,
                address,
                address_number: number,
                status: total == 0 ? 'selected' : null,
                code: generateId()
            })

            if (addressCreated) {
                setAddresses(e => [...e, addressCreated])
                onClose(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={addAddress} className="form-new-address">
            <h4>Nueva dirección</h4>
            <select className="input" name="province" onFocus={getProvinces} onChange={selectProvince}>
                <option value="">Selecciona una provincia</option>
                {provinceList.map(e => <option key={e.id} value={e.nombre}>{e.nombre}</option>)}
            </select>
            {province && <InputCity url={urlApiLocation} province={province} setCity={setCity} />}
            {city &&
                <div className="div-street">
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
    )
}