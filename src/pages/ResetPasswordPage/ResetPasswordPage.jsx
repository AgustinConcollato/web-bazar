import { useNavigate, useParams } from "react-router-dom";
import { url } from "../../services/api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";

export function ResetPasswordPage() {
    const passwordRules = [
        { rule: 'Debe contener al menos 8 caracteres', check: value => value.length >= 8 },
        // { rule: 'Debe contener al menos una letra mayúscula', check: value => /[A-Z]/.test(value) },
        { rule: 'Debe contener al menos un número', check: value => /\d/.test(value) },
        { rule: 'Debe contener al menos una letra', check: value => /[a-zA-Z]/.test(value) },
        // { rule: 'Debe contener al menos un carácter especial', check: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) },
    ];

    const navigate = useNavigate();
    const { token, email } = useParams();
    const { passwordReset, client } = useContext(AuthContext);

    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordRulesVisibility, setPasswordRulesVisibility] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [rulesStatus, setRulesStatus] = useState(passwordRules.map(() => false));

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        setLoading(true)
        try {
            await passwordReset(formData)
        } catch (error) {
console.log(error)

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
                    'The password field is required.',
                    'The password field must contain at least one letter.'
                ],
                name: [
                    'The name field is required.'
                ]
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
        } finally {
            setLoading(false)
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
        console.log(client)
        client !== null && navigate('/')
        document.title = 'Restablecer contraseña'
        scrollTo(0, 0)
    }, [client])

    return (
        <section className="register">
            <form onSubmit={handleSubmit}>
                <h3>Restablecer contraseña</h3>
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="token" value={token} />
                <input
                    type={passwordVisibility ? "text" : "password"}
                    className="input"
                    name="password"
                    placeholder="Nueva contraseña"
                    onChange={changePassword}
                    onFocus={() => setPasswordRulesVisibility(true)}
                    onBlur={() => setPasswordRulesVisibility(false)}
                />
                <div>
                    <input
                        type={passwordVisibility ? "text" : "password"}
                        className="input"
                        name="password_confirmation"
                        placeholder="Confirmar contraseña"
                    />
                    <label><input type="checkbox" onChange={() => setPasswordVisibility(!passwordVisibility)} /> Mostrar constraseña </label>
                </div>
                <button type="submit" className="btn btn-solid" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Restablecer contraseña'}</button>
                <div className="password-rules">
                    {passwordRulesVisibility && passwordRules.map((rule, index) =>
                        <p key={index} style={rulesStatus[index] ? { color: '#66b819' } : {}}>{rule.rule}</p>
                    )}
                </div>
                {errorMessage && <p className="message-error">{errorMessage} <FontAwesomeIcon icon={faXmark} onClick={() => setErrorMessage(null)} /></p>}

            </form>
        </section>
    );
}