import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext'

const Profile = () => {
  const { authUser, updateProfile, setAuthUser } = useContext(AuthContext)
  const [selectedimage, setselectedimage] = useState(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const navigate = useNavigate()
  const [name, setname] = useState(authUser.fullName)
  const [bio, setbio] = useState(authUser.bio)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!selectedimage) {
      await updateProfile({ fullName: name, bio })
      navigate('/')
      return
    }
    // Case 1: selectedimage is a File (from input)
    if (selectedimage instanceof File) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate("/");
      };
      reader.readAsDataURL(selectedimage);
    }
    // Case 2: selectedimage is already a dataURL string (from camera or createObjectURL)
    else if (typeof selectedimage === "string") {
      await updateProfile({ profilePic: selectedimage, fullName: name, bio });
      navigate("/");
    }
  }

  // Open front camera
  const startCamera = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" } // "user" = front, "environment" = back
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Camera access denied:", err)
    }
  }

  // Capture photo
  const takePhoto = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/png")
    setselectedimage(dataUrl)

    // stop camera after capture
    const stream = video.srcObject
    const tracks = stream.getTracks()
    tracks.forEach(track => track.stop())

    setIsCameraOpen(false)
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>

          {/* Upload from file */}
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={(e) => setselectedimage(URL.createObjectURL(e.target.files[0]))}
              type="file"
              id='avatar'
              accept="image/*"
              hidden
            />
            <img
              src={selectedimage || assets.avatar_icon}
              className={`w-12 h-12 ${selectedimage && 'rounded-full'}`}
              alt=""
            />
            Upload Profile Icon
          </label>

          {/* Open Camera Button */}
          <button
            type="button"
            onClick={startCamera}
            className="bg-blue-500 text-white px-3 py-1 rounded-md w-fit"
          >
            Take Photo
          </button>

          {/* Camera Preview */}  
          {isCameraOpen && (
            <div className="flex flex-col items-center gap-2">
              <video ref={videoRef} autoPlay playsInline className="w-40 h-40 border rounded" />
              <button
                type="button"
                onClick={takePhoto}
                className="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                Capture
              </button>
              <canvas ref={canvasRef} hidden></canvas>
            </div>
          )}

          {/* Inputs */}
          <input
            onChange={(e) => setname(e.target.value)}
            type="text"
            placeholder='Your name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
            value={name}
            required
          />
          <textarea
            onChange={(e) => setbio(e.target.value)}
            placeholder='Write your profile bio'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
            rows={4}
            value={bio}
            required
          ></textarea>

          {/* Submit */}
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
          >
            Save
          </button>
        </form>

        {/* Logo */}
        <img
          src={authUser?.profilePic ||assets.logo_icon}
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
          alt=""
        />
      </div>
    </div>
  )
}

export default Profile
