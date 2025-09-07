import React, { useState } from 'react'
import assets from '../assets/assets'

const Login = () => {
  const [currentstate,setcurrentstate] = useState("Sign Up")
  const [fullName,setfullName] = useState("")
  const [email,setemail] = useState("")
  const [password,setpassword] = useState("")
  const [bio, setbio] = useState("")
  const [isDatasubmitted,setisDatasubmitted] = useState(false)
   
  const onSubmitHandler = (e) => {
    e.preventDefault()

    if(currentstate === 'Sign Up' && !isDatasubmitted){
      setisDatasubmitted(true)
      return
    }
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left side */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]'/>
      {/* right side*/}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>{currentstate}
          {isDatasubmitted &&  
          <img onClick={()=>setisDatasubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />
        }
        </h2>
        {currentstate === "Sign Up" && !isDatasubmitted && (<input onChange={(e)=>setfullName(e.target.value)} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required value={fullName}/>)}

        {!isDatasubmitted && (
          <>
          <input onChange={(e)=>setemail(e.target.value)} type="email" required placeholder='Email Address' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' value={email}/>
          <input onChange={(e)=>setpassword(e)} type="password" required placeholder='Enter Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' value={password}/>
          </>
        )}

        {
         currentstate==='Sign Up' && isDatasubmitted &&  <textarea onChange={(e)=>setbio(e.target.value)} rows={4} className='p-2 border border0gray-500 rounded-md focus:outline-none foucs: ring-2 focus: ring-indigo-500' placeholder='provide a short bio...' value={bio} ></textarea>
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentstate === 'Sign Up' ? "Create Account" : "Login Now"}
        </button>
        <div>
         {currentstate === 'Sign Up' ? 
         (<p className='text-sm text-gray-600'>
          Already have an account? <span className='font-medium text-violet-500 cursor-pointer' onClick={()=>{setcurrentstate("Login"); setisDatasubmitted(false)}}>Login Here</span>
         </p>) 
         : 
         (
          <p className='text-sm text-gray-600'>
            Create an account <span className='font-medium text-violet-500 cursor-pointer' onClick={()=>{setcurrentstate("Sign Up")}}>Click here</span>
         </p>)}  
        </div>          
      </form>         
    </div>
  )
}

export default Login