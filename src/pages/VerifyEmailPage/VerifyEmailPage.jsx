import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Loading } from "../../components/Loading/Loading"
import { AuthContext } from "../../context/authContext"
import { api } from "../../services/api"
import './VerifyEmailPage.css'

export function VerifyEmailPage() {

    const { client } = useContext(AuthContext)

    const { Mail, Auth } = api
    const mail = new Mail()
    const auth = new Auth()

    const [emailSent, setEmailSent] = useState(false)
    const [code, setCode] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingResend, setLoadingResend] = useState(false)
    const [updateEmail, setUpdateEmail] = useState(false)
    const [errorEmail, setErrorEmail] = useState('')
    const [loadingEmail, setLoadingEmail] = useState(false)

    async function sendEmailVerification(email) {
        setLoading(true)
        try {
            const response = await mail.verify(email)

            if (response) {
                setEmailSent(true)
            }

        } catch (error) {
            console.log(error)
            setEmailSent(true)
        } finally {
            setLoading(false)
        }

    }

    async function resendCode() {
        setLoadingResend(true)
        try {
            const response = await mail.verify(email)

            if (response) {
                setEmailSent(true)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingResend(false)
        }
    }

    async function verifyCode(e) {
        e.preventDefault()

        setError('')

        if (!code) {
            return setError('El código de verificación es requerido')
        }
        if (code.length < 6) {
            return setError('El código de verificación es inválido')
        }

        try {
            const response = await mail.verifyCode(code)

            if (response.email_verified_at) {
                return window.location.href = '/'
            }
        } catch ({ error }) {
            if (error === 'invalid code') {
                setError('El código de verificación es incorrecto')
            } else if (error === 'code expired') {
                setError('El código de verificación ha expirado')
            } else {
                setError('Ocurrió un error al verificar el código')
            }
        }
    }

    async function handleEmailChange(e) {
        e.preventDefault()

        const email = { email: e.target.email.value }

        // comprobar si el nuevo correo electrónico es igual al actual
        if (email.email == client.email) {
            setErrorEmail('El correo electrónico es el mismo que el actual')
            return
        }

        setErrorEmail('')

        try {
            setLoadingEmail(true)
            const response = await auth.updateEmail(email)
            if (response) {
                client.email = response.email
                setUpdateEmail(false)
                setEmailSent(false)
            }
        } catch (error) {
            if (error.errors.email[0] == 'The email has already been taken.') {
                setErrorEmail('El correo electrónico ya está en uso')
            }

            if (error.errors.email[0] == "The email field is required.") {
                setErrorEmail('Completa con el correo electrónico')
            }
        } finally {
            setLoadingEmail(false)
        }
    }

    useEffect(() => {
        document.title = 'Verifica tu correo electrónico'

        if (client) {
            if (client.email_verified_at) {
                return window.location.href = '/'
            }

            if (!client.email_verified_at && !emailSent) {
                sendEmailVerification(client.email)
            }
        }

    }, [client, emailSent])

    return (
        <section className="section-verify-email">
            {client && !loading ?
                <div>
                    <div>
                        <h2>Verifica tu correo electrónico</h2>
                        <p>
                            Hemos enviado un código de verificación a <b>{emailSent && client.email}</b>
                        </p>
                    </div>

                    <form onSubmit={verifyCode} className="form-verify-email">
                        <input
                            type="text"
                            placeholder="Código de verificación"
                            className="input"
                            name="code"
                            autoComplete="off"
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button type="submit" className="btn btn-solid">Verificar</button>
                    </form>
                    {error && <p className="message-error">{error} <FontAwesomeIcon icon={faXmark} onClick={() => setError('')} /> </p>}
                    <div>
                        <p>Si no encuentras el correo, revisa tu carpeta de spam o intenta nuevamente</p>
                        <button onClick={() => resendCode(client.email)} className="btn btn-regular" disabled={loadingResend}>{loadingResend ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Reenviar código'}</button>
                    </div>
                    <div className="update-email">
                        <p>Si te equivocaste o simplemente quieres cambiar tu correo electrónico, puedes hacerlo aquí <button onClick={() => setUpdateEmail(true)} className="btn-change-email"><b>Cambiar correo electrónico</b></button></p>
                        {updateEmail &&
                            <form onSubmit={handleEmailChange}>
                                <input type="email" placeholder="Nuevo correo electrónico" className="input" name="email" />
                                <div>
                                    <button type="button" className="btn" onClick={() => setUpdateEmail(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-solid" disabled={loadingEmail}>{loadingEmail ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Cambiar correo electrónico'}</button>
                                </div>
                                {errorEmail && <p className="message-error">{errorEmail} <FontAwesomeIcon icon={faXmark} onClick={() => setErrorEmail('')} /> </p>}
                            </form>
                        }
                    </div>
                </div> :
                <div className="loading-container">
                    <p>Enviando correo de verificación...</p>
                    <Loading />
                </div>
            }
        </section>
    )
}