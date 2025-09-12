import React, { useContext, useState } from 'react'
import assets from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'

const Login = () => {
    const [currentstate, setcurrentstate] = useState("Sign Up");
    const [fullName, setfullName] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [bio, setbio] = useState("");
    const [isDatasubmitted, setisDatasubmitted] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetemail, setresetEmail] = useState("");
    const { login, resetEmail } = useContext(AuthContext);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (currentstate === 'Sign Up' && !isDatasubmitted) {
            setisDatasubmitted(true);
            return;
        }
        login(currentstate === 'Sign Up' ? 'signup' : 'login', { fullName, email, password, bio });
    };

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        resetEmail(resetemail)
    };

    // Handler for Google Login
    const handleGoogleLogin = () => {
        const backendUrl = 'http://localhost:5000';
        window.location.href = `${backendUrl}/auth/google`;
    };

    return (
        <div className='min-h-screen bg-gray-900 bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4'>
            <img src={assets.logo_big} alt="App Logo" className='w-[min(30vw,250px)]' />

            <form onSubmit={forgotPassword ? handleForgotPasswordSubmit : onSubmitHandler} className='border-2 bg-white/10 text-gray-200 border-gray-700 p-6 flex flex-col gap-5 rounded-lg shadow-2xl w-full max-w-sm'>
                <h2 className='font-medium text-2xl flex justify-between items-center'>
                    {forgotPassword ? "Reset Password" : currentstate}
                    {isDatasubmitted && !forgotPassword &&
                        <img onClick={() => setisDatasubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="Back" />
                    }
                </h2>

                {/* --- Forgot Password Form --- */}
                {forgotPassword ? (
                    <>
                        <p className='text-gray-400 text-sm'>Enter your email to receive a password reset link.</p>
                        <input
                            onChange={(e) => setresetEmail(e.target.value)}
                            type="email"
                            required
                            placeholder='Email Address'
                            className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
                            value={resetemail}
                        />
                        <button type='submit' className='py-3 bg-gradient-to-r from-purple-500 to-violet-700 hover:from-purple-600 hover:to-violet-800 text-white font-semibold rounded-md cursor-pointer transition-all duration-300'>
                            Send Reset Link
                        </button>
                        <p className='text-sm text-gray-400 mt-2 text-center cursor-pointer hover:underline' onClick={() => setForgotPassword(false)}>
                            Back to Login
                        </p>
                    </>
                ) : (
                    <>
                        {currentstate === "Sign Up" && !isDatasubmitted && (
                            <input onChange={(e) => setfullName(e.target.value)} type="text" className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' placeholder='Full Name' required value={fullName} />
                        )}
                        {!isDatasubmitted && (
                            <>
                                <input onChange={(e) => setemail(e.target.value)} type="email" required placeholder='Email Address' className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' value={email} />
                                <input onChange={(e) => setpassword(e.target.value)} type="password" required placeholder='Enter Password' className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' value={password} />
                            </>
                        )}
                        {currentstate === 'Sign Up' && isDatasubmitted && <textarea onChange={(e) => setbio(e.target.value)} rows={4} className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' placeholder='Provide a short bio...' value={bio}></textarea>}
                        <button type='submit' className='py-3 bg-gradient-to-r from-purple-500 to-violet-700 hover:from-purple-600 hover:to-violet-800 text-white font-semibold rounded-md cursor-pointer transition-all duration-300'>
                            {currentstate === 'Sign Up' ? (isDatasubmitted ? "Create Account" : "Continue") : "Login Now"}
                        </button>

                        {currentstate !== "Sign Up" && <p className='text-sm text-gray-400 text-center cursor-pointer hover:underline mt-2' onClick={() => setForgotPassword(true)}>
                            Forgot your password?
                        </p>}

                        {/* Google Login */}
                        <div className='flex items-center gap-3 mt-4'>
                            <hr className='flex-1 border-t border-gray-600' />
                            <p className='text-gray-400 text-sm'>OR</p>
                            <hr className='flex-1 border-t border-gray-600' />
                        </div>
                        <button
                            type='button'
                            onClick={handleGoogleLogin}
                            className='w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 font-medium mt-2'>
                            Continue with Google
                        </button>

                        <div>
                            {currentstate === 'Sign Up' ?
                                (<p className='text-sm text-gray-400 mt-2 text-center'>Already have an account? <span className='font-medium text-violet-400 cursor-pointer hover:underline' onClick={() => { setcurrentstate("login"); setisDatasubmitted(false) }}>Login Here</span></p>) :
                                (<p className='text-sm text-gray-400 mt-2 text-center'>Create an account? <span className='font-medium text-violet-400 cursor-pointer hover:underline' onClick={() => { setcurrentstate("Sign Up") }}>Click here</span></p>)}
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}

export default Login
