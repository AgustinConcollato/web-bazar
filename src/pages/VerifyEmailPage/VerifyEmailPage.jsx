import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Loading } from "../../components/Loading/Loading"
import { AuthContext } from "../../context/authContext"
import { api } from "../../services/api"
import './VerifyEmailPage.css'

export function VerifyEmailPage() {

    const { client } = useContext(AuthContext)

    const { Mail } = api
    const mail = new Mail()

    const [emailSent, setEmailSent] = useState(false)
    const [code, setCode] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingResend, setLoadingResend] = useState(false)

    async function sendEmailVerification() {
        setLoading(true)
        try {
            const response = await mail.verify(client.email)

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
            const response = await mail.verify(client.email)

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

    useEffect(() => {
        document.title = 'Verifica tu correo electrónico'

        if (client) {
            if (client.email_verified_at) {
                return window.location.href = '/'
            }

            if (!client.email_verified_at && !emailSent) {
                sendEmailVerification()
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
                            Hemos enviado un código de verificación a <b>{emailSent && client.email}</b>.
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
                        <button onClick={resendCode} className="btn btn-regular" disabled={loadingResend}>{loadingResend ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Reenviar código'}</button>
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