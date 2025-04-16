import { faAngleUp, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Address } from "../../services/addressService"
import { Loading } from "../Loading/Loading"
import { NewAddress } from "../NewAddress/NewAddress"
import './Addresses.css'

export function Addresses({ user, type, onChange }) {

    const address = new Address(user.uid)

    const [addresses, setAddresses] = useState(null)
    const [selected, setSelected] = useState(0)
    const [formNewAddress, setFormNewAddress] = useState(false)

    async function getAddress() {

        try {
            const response = await address.get()

            response.forEach((e) => {
                if (type == 'MODAL' && localStorage.getItem('address')) {
                    const sessionAddress = localStorage.getItem('address')
                    e.code == JSON.parse(sessionAddress).code && setSelected(e)
                    return
                }

                e.status && setSelected(e)
            });

            setAddresses(response)
        } catch (error) {
            setAddresses([])
            localStorage.removeItem('address')
            return
        }
    }

    async function saveAddrees(e) {
        try {
            const response = await address.save(e)
            setAddresses(response)
        } catch (error) {
            console.log(error)
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
                            type == 'PROFILE' ?
                                <AddressListProfile
                                    e={e}
                                    selected={selected}
                                    setSelected={setSelected}
                                /> :
                                <AddressListModal
                                    e={e}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
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
                                JSON.parse(localStorage.getItem('address'))?.code != selected.code &&
                                <button
                                    style={{ order: 1 }}
                                    className="btn"
                                    onClick={() => {
                                        localStorage.setItem('address', JSON.stringify(selected))
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

function AddressListProfile({ e, selected, setSelected }) {
    return (
        <div
            key={e.code}
            onClick={() => setSelected(e)}
            className={
                selected.code == e.code ?
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
    )
}

function AddressListModal({ e, selected, setSelected }) {
    return (
        <div
            key={e.code}
            onClick={() => setSelected(e)}
            className={
                (selected.code == e.code && !localStorage.getItem('address')) ?
                    'address address-selected' :
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
    )
}