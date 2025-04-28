import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import './Register.css';

export const Register = () => {

    const passwordRules = [
        { rule: 'Debe contener al menos 8 caracteres', check: value => value.length >= 8 },
        { rule: 'Debe contener al menos una letra mayúscula', check: value => /[A-Z]/.test(value) },
        { rule: 'Debe contener al menos un número', check: value => /\d/.test(value) },
        { rule: 'Debe contener al menos un carácter especial', check: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) },
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

            const { email, name, password } = error.errors

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
                    'The password field is required.'
                ],
                name: [
                    'The name field is required.'
                ]
            }

            if (name && typeErrors.name[0] == name[0]) {
                return setErrorMessage('Completa con tu nombre')
            }

            if (email) {
                if (typeErrors.email[0] == email[0]) {
                    return setErrorMessage('El correo electrónico está en uso')
                }

                if (typeErrors.email[1] == email[0]) {
                    return setErrorMessage('Completa con tu correo electrónico')
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