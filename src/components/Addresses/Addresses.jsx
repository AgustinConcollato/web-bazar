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
                        <>
                            {(selected != i && e.status) &&
                                <button
                                    style={{ marginRight: '10px' }}
                                    className="btn btn-solid"
                                    onClick={() => {
                                        saveAddrees(addresses[selected])
                                        type == 'MODAL' && onChange(addresses[selected])
                                    }}
                                >
                                    Cambiar dirección principal
                                </button>
                            }
                            {(selected != i && type == 'MODAL') &&
                                <button
                                    className="btn"
                                    onClick={() => {
                                        sessionStorage.setItem('address', JSON.stringify(addresses[selected]))
                                        onChange(addresses[selected])
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