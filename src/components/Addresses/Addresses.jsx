import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { url } from "api-services"
import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import { Loading } from "../Loading/Loading"
import { NewAddress } from "../NewAddress/NewAddress"
import './Addresses.css'

export function Addresses({ user }) {

    const [addresses, setAddresses] = useState(null)
    const [selected, setSelected] = useState(0)

    async function getAddress(userId) {
        const response = await fetch(`${url}/user/${userId}`)

        if (!response.ok) {
            setAddresses([])
            return
        }

        const address = await response.json()

        address.forEach((e, i) => {
            e.status && setSelected(i)
        });

        setAddresses(address)
    }

    async function saveAddrees(address) {
        const response = await fetch(url + '/user/' + user.uid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: address.code })
        })

        if (response.ok) {

            const addresses = await response.json()
            setAddresses(addresses)
        }

    }

    useEffect(() => {
        getAddress(user.uid)
    }, [])

    return (
        addresses ?
            <div className="addresses">
                <h4>Tus direcciones</h4>
                {addresses.length != 0 ?
                    <div className="container-address">
                        {addresses.map((e, i) =>
                            <div
                                onClick={() => setSelected(i)}
                                className={selected == i ? 'address address-selected' : 'address'}
                            >
                                <FontAwesomeIcon icon={faLocationDot} />
                                <div>
                                    <p>{e.address} {e.address_number}</p>
                                    <p>{e.city}, {e.province}</p>
                                </div>
                            </div>
                        )}
                    </div> :
                    <div className="not-addresses">
                        <p>no hay direcciones registradas</p>
                    </div>
                }
                <div>
                    {addresses.map((e, i) =>
                        (selected != i && e.status) &&
                        <button
                            className="btn btn-solid"
                            onClick={() => saveAddrees(addresses[selected])}
                        >
                            Cambiar dirección principal
                        </button>
                    )}
                </div>
                <Routes>
                    <Route path={'/'} element={
                        <Link
                            to={'nueva-direccion'}
                            className="btn btn-new-address"
                        >
                            Agregar nueva dirección
                        </Link>
                    } />
                    <Route path={'/nueva-direccion'} element={<NewAddress setAddresses={setAddresses} total={addresses?.length} />} />
                </Routes>
            </div> :
            <Loading />
    )
}