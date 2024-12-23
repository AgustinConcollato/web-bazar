import { faAngleUp, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { url } from "api-services"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { NewAddress } from "../NewAddress/NewAddress"
import './Addresses.css'

export function Addresses({ user, type, onChange }) {

    const [addresses, setAddresses] = useState(null)
    const [selected, setSelected] = useState(0)
    const [formNewAddress, setFormNewAddress] = useState(false)

    async function getAddress(userId) {
        const response = await fetch(`${url}/user/${userId}`)

        if (!response.ok) {
            setAddresses([])
            sessionStorage.removeItem('address')
            return
        }

        const address = await response.json()

        address.forEach((e) => {

            if (sessionStorage.getItem('address')) {
                const sessionAddress = sessionStorage.getItem('address')
                e.code == JSON.parse(sessionAddress).code && setSelected(e)
                return
            }

            e.status && setSelected(e)
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
                        {addresses.map(e =>
                            <div
                                key={e.code}
                                onClick={() => setSelected(e)}
                                className={
                                    (selected.code == e.code && type == 'PROFILE') ||
                                        (selected.code == e.code && type == 'MODAL' && !sessionStorage.getItem('address')) ||
                                        (e.code == selected.code) ?
                                        'address address-selected' :
                                        'address'
                                }
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
                <div className="container-btn-change-address">
                    {addresses.map(e =>
                        <>
                            {(e.status != 'selected' && e.code == selected.code) &&
                                <button
                                    style={{ order: 0 }}
                                    className="btn btn-solid"
                                    onClick={() => {
                                        saveAddrees(selected)
                                        type == 'MODAL' && onChange(selected)
                                    }}
                                >
                                    Cambiar dirección principal
                                </button>
                            }
                            {(e.code == selected.code && type == 'MODAL') &&
                                JSON.parse(sessionStorage.getItem('address'))?.code != selected.code &&
                                <button
                                    style={{ order: 1 }}
                                    className="btn"
                                    onClick={() => {
                                        sessionStorage.setItem('address', JSON.stringify(selected))
                                        onChange(selected)
                                    }}
                                >
                                    Cambiar solo para este pedido
                                </button>
                            }
                        </>
                    )}
                </div>
                {formNewAddress &&
                    <NewAddress
                        setAddresses={setAddresses}
                        onClose={setFormNewAddress}
                        total={addresses?.length}
                    />
                }
                <button
                    className="btn btn-new-address"
                    onClick={() => setFormNewAddress(!formNewAddress)}
                >
                    {formNewAddress ?
                        <FontAwesomeIcon icon={faAngleUp} /> :
                        'Agregar nueva dirección'
                    }
                </button>
            </div> :
            <Loading />
    )
}