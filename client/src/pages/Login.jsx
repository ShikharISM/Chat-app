import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'

const Login = () => {
  const [currentstate, setcurrentstate] = useState("Sign Up");
    const [fullName, setfullName] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [bio, setbio] = useState("");
    const [isDatasubmitted, setisDatasubmitted] = useState(false);
    const { login } = useContext(AuthContext);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (currentstate === 'Sign Up' && !isDatasubmitted) {
            setisDatasubmitted(true);
            return;
        }
        login(currentstate === 'Sign Up' ? 'signup' : 'login', { fullName, email, password, bio });
    };

    // Handler for Google Login
    const handleGoogleLogin = () => {
        // This URL must point to your backend server (port 5000), which handles the Google auth process.
        const backendUrl = 'http://localhost:5000';
        window.location.href = `${backendUrl}/auth/google`;
    };

    return (
        <div className='min-h-screen bg-gray-900 bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4'>
            <img src={assets.logo_big} alt="App Logo" className='w-[min(30vw,250px)]' />
            <form onSubmit={onSubmitHandler} className='border-2 bg-white/10 text-gray-200 border-gray-700 p-6 flex flex-col gap-5 rounded-lg shadow-2xl w-full max-w-sm'>
                <h2 className='font-medium text-2xl flex justify-between items-center'>{currentstate}
                    {isDatasubmitted &&
                        <img onClick={() => setisDatasubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="Back" />
                    }
                </h2>
                {currentstate === "Sign Up" && !isDatasubmitted && (<input onChange={(e) => setfullName(e.target.value)} type="text" className='p-3 bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' placeholder='Full Name' required value={fullName} />)}
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
                
                {/* --- GOOGLE LOGIN SECTION --- */}
                <div className='flex items-center gap-3'>
                    <hr className='flex-1 border-t border-gray-600' />
                    <p className='text-gray-400 text-sm'>OR</p>
                    <hr className='flex-1 border-t border-gray-600' />
                </div>
                <button
                    type='button'
                    onClick={handleGoogleLogin}
                    className='w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 font-medium'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.082,5.571l6.19,5.238C42.022,35.398,44,30.076,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                    Continue with Google
                </button>
                {/* --- END OF GOOGLE LOGIN SECTION --- */}

                <div>
                    {currentstate === 'Sign Up' ?
                        (<p className='text-sm text-gray-400 mt-2 text-center'>Already have an account? <span className='font-medium text-violet-400 cursor-pointer hover:underline' onClick={() => { setcurrentstate("login"); setisDatasubmitted(false) }}>Login Here</span></p>) :
                        (<p className='text-sm text-gray-400 mt-2 text-center'>Create an account? <span className='font-medium text-violet-400 cursor-pointer hover:underline' onClick={() => { setcurrentstate("Sign Up") }}>Click here</span></p>)}
                </div>
            </form>
        </div>
  )
}

export default Login

