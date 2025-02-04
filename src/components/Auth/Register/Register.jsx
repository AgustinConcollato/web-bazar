import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import './Register.css';

import { getAuth, validatePassword } from "firebase/auth";
import { AuthProviderButtons } from "../AuthProviderButtons";

export const Register = () => {

    const navigate = useNavigate()
    const { register, user } = useContext(AuthContext)
    const passwordRef = useRef()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [requirements, setRequirements] = useState([])

    function validateForm(e) {
        e.preventDefault()

        if (requirements.length == 0) {
            if (email !== '' && password !== '' && name !== '') {
                const dataRegister = {
                    email,
                    password,
                    name
                }
                register(dataRegister, setError)
            } else {
                setError('Completa todos los campos')
            }
        } else {
            setError('Completa con todos los requisitos de la contraseña')
        }
    }

    function validateName(e) {
        const value = e.target.value.trim()
        setError('')

        const expresionNombre = /^[a-zA-Z ]+$/
        if (expresionNombre.test(value)) {
            setName(value)
            setError('')
        } else {
            setName('')
            setError('El nombre no debe contener números ni símbolos')
        }

        value === '' && setError('')
    }

    function validateEmail(e) {
        const value = e.target.value.trim()
        setError('')

        const expresionCorreo = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (expresionCorreo.test(value)) {
            setEmail(value)
            setError('')
        } else {
            setEmail('')
            setError('La dirección de correo no tiene el formato requerido')
        }

        value === '' && setError('')
    }

    async function checkPassword(e) {
        const password = e.target.value.trim()
        setError('')
        setRequirements([]);

        try {
            const result = await validatePassword(getAuth(), password);
            if (result.isValid) {
                setError('')
                setRequirements([]);
                setPassword(password)
            } else {
                const requirements = [];
                if (password) {

                    if (!result.meetsMinPasswordLength) requirements.push("Debe tener al menos 8 caracteres.");
                    if (!result.containsUppercaseLetter) requirements.push("Debe contener al menos una letra mayúscula.");
                    if (!result.containsNumericCharacter) requirements.push("Debe contener al menos un número.");
                    if (!result.containsNonAlphanumericCharacter) requirements.push("Debe contener al menos un carácter especial.");

                    setRequirements(requirements);
                }
            }
        } catch (error) {
            console.error("Error al validar la contraseña:", error);
        }
    }

    useEffect(() => {
        user !== null && navigate('/')
        document.title = 'Registrarse'
    }, [user])

    return (
        <section className="register">
            <p>Crear cuenta con correo electrónco</p>
            <form onSubmit={validateForm}>
                <input onChange={validateName} className="input" type="text" placeholder="Nombre y Apellido" autoComplete="off" />
                <input onChange={validateEmail} className="input" type="email" placeholder="Correo electrónico" />
                <input onChange={checkPassword} ref={passwordRef} className="input" type="password" placeholder="Contraseña" />
                <button type="submit" className="btn btn-solid">Registrarse</button>
            </form>
            {error && <p className="message-error"> {error} </p>}
            <div>
                {requirements && requirements.map((e) => <p className="message-notification"> {e} </p>)}
            </div>
            <div className="div"></div>
            <p>Crear cuenta con</p>
            <AuthProviderButtons setError={setError} />
            <Link to={'/iniciar-sesion'} className="btn btn-auth">Iniciar sesión</Link>
        </section>
    )
}