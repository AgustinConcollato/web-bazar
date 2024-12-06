import React, { createContext, useState, useEffect } from "react"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider
} from "firebase/auth"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate()
    const auth = getAuth()
    const [user, setUser] = useState(null)


    const loginWhitFacebook = (setError) => {
        const facebookProvider = new FacebookAuthProvider()
        signInWithPopup(auth, facebookProvider)
            .then(e => e && window.history.back())
            .catch((error) => setError(error.message))
    }

    const loginWhitGoogle = (setError) => {
        const googleProvider = new GoogleAuthProvider()
        signInWithPopup(auth, googleProvider)
            .then(e => e && window.history.back())
            .catch((error) => setError(error.message))
    }

    const register = ({ email, password, name }, setError) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: name,
                }).then(() => navigate('/'))
            })
            .catch(error => {
                error.code === 'auth/email-already-in-use' && setError('Este correo electrónico ya está en uso.')
            })
    }

    const login = ({ email, password }, setError) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate("/")
            })
            .catch(error => {
                setError(() => {
                    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found')
                        return 'El correo electrónico o la contraseña son incorrectos.'
                    else if (error.code === 'auth/too-many-requests')
                        return 'El acceso a esta cuenta se ha inhabilitado temporalmente debido a muchos intentos fallidos de inicio de sesión. Puede restaurarlo inmediatamente restableciendo su contraseña o puede volver a intentarlo más tarde.'
                }
                )
            })
    }

    const logOut = () => {
        signOut(auth)
            .then(() => {
                setUser(null)
            })
    }

    const passwordReset = (email, setError, setSuccess) => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setSuccess('¡El correo se envió correctamente! Ya puedes iniciar sesión con tu contraseña nueva. (Revisa el "spam")')
            })
            .catch((error) => error.code === 'auth/user-not-found' && setError('No se encontró ningún usuario con este correo.'))
    }

    // const updateUserPhoto = ({ uid, photo }, setStateUpdate) => {

    //     const userData = new FormData()
    //     userData.append('uid', uid)
    //     userData.append('photo', photo)

    //     fetch(`${urlHost}updateUserPhoto.php`, {
    //         method: 'POST',
    //         body: userData
    //     }) 
    //         .then(e => e.json())
    //         .then(e => {
    //             const { response, message } = e
    //             if (response === 'success') {
    //                 updateProfile(auth.currentUser, {
    //                     photoURL: photo ? `${urlHost}p/${uid}/${photo.name}` : '',
    //                 }).then(() => {
    //                     setStateUpdate(true)
    //                 })
    //             }
    //         })
    // }

    // const deleteUserPhoto = (setStateUpdate) => {
    //     updateProfile(auth.currentUser, {
    //         photoURL: '',
    //     }).then(() => {
    //         setStateUpdate(true)
    //     })
    // }

    useEffect(() => {
        onAuthStateChanged(auth, user => user && setUser(user))
    }, [])

    return <AuthContext.Provider value={{
        register,
        login,
        logOut,
        passwordReset,
        loginWhitGoogle,
        loginWhitFacebook,
        // updateUserPhoto,
        // deleteUserPhoto,
        user
    }}>
        {children}
    </AuthContext.Provider>
}
