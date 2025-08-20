import { faCircleNotch, faExclamationCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import './Register.css';

export const Register = () => {

    const passwordRules = [
        { rule: 'Debe contener al menos 8 caracteres', check: value => value.length >= 8 },
        // { rule: 'Debe contener al menos una letra mayúscula', check: value => /[A-Z]/.test(value) },
        { rule: 'Debe contener al menos un número', check: value => /\d/.test(value) },
        { rule: 'Debe contener al menos una letra', check: value => /[a-zA-Z]/.test(value) },
        // { rule: 'Debe contener al menos un carácter especial', check: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) },
    ];

    const { register, client } = useContext(AuthContext)
    const navigate = useNavigate()

    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [passwordRulesVisibility, setPasswordRulesVisibility] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [rulesStatus, setRulesStatus] = useState(passwordRules.map(() => false));

    async function registerClient(e) {
        e.preventDefault()
        setLoading(true)

        const data = new FormData(e.target)

        try {
            const client = await register(data)
            setLoading(false)

            client && navigate('/verificar-correo')

        } catch (error) {

            setLoading(false)
            setPasswordRulesVisibility(false)

            const { email, name, password, phone_number, type } = error.errors

            const typeErrors = {
                email: [
                    'The email has already been taken.',
                    'The email field is required.'
                ],
                password: [
                    'The password field confirmation does not match.',
                    'The password field must contain at least one symbol.',
                    'The password field must contain at least one number.',
                    'The password field must contain at least one uppercase and one lowercase letter.',
                    'The password field must be at least 8 characters.',
                    'The password field is required.',
                    'The password field must contain at least one letter.'
                ],
                name: [
                    'The name field is required.'
                ],
                phone_number: [
                    'The phone number field is required.'
                ],
                type: [
                    'The type field is required.',
                    'The selected type is invalid.'
                ]
            }

            if (name) {
                if (typeErrors.name[0] == name[0]) {
                    return setErrorMessage('Completa con tu nombre')
                }
            }

            if (email) {
                if (typeErrors.email[0] == email[0]) {
                    return setErrorMessage('El correo electrónico está en uso')
                }

                if (typeErrors.email[1] == email[0]) {
                    return setErrorMessage('Completa con tu correo electrónico')
                }
            }

            if (phone_number) {
                if (typeErrors.phone_number[0] == phone_number[0]) {
                    return setErrorMessage('Completa con un número de teléfono')
                }
            }

            if (type) {
                if (typeErrors.type[0] == type[0]) {
                    return setErrorMessage('Selecciona tipo de cuenta')
                }

                if (typeErrors.type[1] == type[0]) {
                    return setErrorMessage('Selecciona tipo de cuenta')
                }
            }

            if (password) {
                if (typeErrors.password[5] == password[0]) {
                    return setErrorMessage('Completa la contraseña')
                }

                if (typeErrors.password[0] == password[0]) {
                    return setErrorMessage('Las contraseñas son distintas')
                }

                if (typeErrors.password[3] == password[0]) {
                    return setErrorMessage('La contraseña debe contener al menos una letra mayúscula')
                }

                if (typeErrors.password[2] == password[0]) {
                    return setErrorMessage('Las contraseñas debe contener al menos un número')

                }

                if (typeErrors.password[1] == password[0]) {
                    return setErrorMessage('Debe contener al menos un carácter especial')
                }

                if (typeErrors.password[4] == password[0]) {
                    return setErrorMessage('Debe contener al menos 8 caracteres')
                }

                if (typeErrors.password[6] == password[0]) {
                    return setErrorMessage('Debe contener al menos una letra')
                }
            }
        }
    }

    function changePassword(e) {

        changeInput()
        setPasswordRulesVisibility(true)

        const newRulesStatus = passwordRules.map(rule => rule.check(e.target.value));
        setRulesStatus(newRulesStatus)
    }

    function changeInput() {
        setErrorMessage(null)
    }


    useEffect(() => {
        client !== null && navigate('/')
        document.title = 'Registrarse'
        scrollTo(0, 0)
    }, [client])

    return (
        <section className="register">
            <h3>Crear cuenta</h3>
            <form onSubmit={registerClient}>
                <input
                    className="input"
                    autoComplete="off"
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    onChange={changeInput}
                />
                <input
                    className="input"
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    onChange={changeInput}
                />

                <input
                    className="input"
                    autoComplete="off"
                    type="tel"
                    name="phone_number"
                    placeholder="Número de teléfono (opcional)"
                    onChange={changeInput}
                />
                <div className="client-type">
                    <p>Tipo de cuenta
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" color="#888" fill="none">
                                <path d="M21.5 12.6863V11.3137C21.5 9.67871 21.5 8.8612 21.1955 8.12612C20.891 7.39104 20.313 6.81297 19.1569 5.65685L18.3431 4.84315C17.187 3.68702 16.609 3.10896 15.8739 2.80448C15.1388 2.5 14.3213 2.5 12.6863 2.5H11.3137C9.67871 2.5 8.8612 2.5 8.12612 2.80448C7.39104 3.10896 6.81297 3.68702 5.65685 4.84315L4.84315 5.65685C3.68702 6.81298 3.10896 7.39104 2.80448 8.12612C2.5 8.8612 2.5 9.67871 2.5 11.3137V12.6863C2.5 14.3213 2.5 15.1388 2.80448 15.8739C3.10896 16.609 3.68702 17.187 4.84315 18.3431L5.65685 19.1569C6.81297 20.313 7.39104 20.891 8.12612 21.1955C8.8612 21.5 9.67871 21.5 11.3137 21.5H12.6863C14.3213 21.5 15.1388 21.5 15.8739 21.1955C16.609 20.891 17.187 20.313 18.3431 19.1569L19.1569 18.3431C20.313 17.187 20.891 16.609 21.1955 15.8739C21.5 15.1388 21.5 14.3213 21.5 12.6863Z" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M12 8L12 12.5" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M12 15.9883V15.9983" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p className="client-type-message">Si es necesario en el futuro, podrás pedir el cambio de tipo de cuenta desde tu perfil</p>
                        </div>
                    </p>
                    <select name="type" className="input">
                        <option >Seleccioná un tipo de cuenta</option>
                        <option value="final">Consumidor final</option>
                        <option value="reseller">Revendedor / Negocio</option>
                    </select>
                </div>
                <input
                    className="input"
                    autoComplete="off"
                    type={passwordVisibility ? "text" : "password"}
                    placeholder="Contraseña"
                    name="password"
                    onChange={changePassword}
                    onFocus={() => setPasswordRulesVisibility(true)}
                    onBlur={() => setPasswordRulesVisibility(false)}
                />
                <div>
                    <input
                        className="input"
                        autoComplete="off"
                        type={passwordVisibility ? "text" : "password"}
                        name="password_confirmation"
                        placeholder="Confirmar contraseña"
                        onChange={changeInput}
                    />
                    <label><input type="checkbox" onChange={() => setPasswordVisibility(!passwordVisibility)} /> Mostrar constraseñas </label>
                </div>
                <button type="submit" className="btn btn-solid" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Crear cuenta'}</button>
                <div className="password-rules">
                    {passwordRulesVisibility && passwordRules.map((rule, index) =>
                        <p key={index} style={rulesStatus[index] ? { color: '#66b819' } : {}}>{rule.rule}</p>
                    )}
                </div>
                {errorMessage && <p className="message-error">{errorMessage} <FontAwesomeIcon icon={faXmark} onClick={() => setErrorMessage(null)} /></p>}
            </form>
            <div className="div"></div>
            <Link to={'/iniciar-sesion'} className="btn btn-auth">Iniciar sesión</Link>
        </section>
    )
}