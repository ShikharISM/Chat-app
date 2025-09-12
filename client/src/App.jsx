import React, { useContext } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext.jsx'
import Callback from './pages/Callback.jsx'

const App = () => {
  const { authUser } = useContext(AuthContext)

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to='/login' />} />
        <Route path="/auth/callback/*" element={<Callback />} />
      </Routes>

    </div>
  )
}

export default App