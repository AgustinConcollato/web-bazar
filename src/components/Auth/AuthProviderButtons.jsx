import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import facebook from '../../assets/img/facebook.png'
import google from '../../assets/img/google.png'

export function AuthProviderButtons({ setError }) {
    const { loginWhitGoogle, loginWhitFacebook } = useContext(AuthContext)

    return (
        <div className='container-btn-auth'>
            <button className='btn btn-auth' onClick={() => loginWhitGoogle(setError)}><img src={google} /></button>
            <button className='btn btn-auth' onClick={() => loginWhitFacebook(setError)}><img src={facebook} /></button>
        </div>
    )
}