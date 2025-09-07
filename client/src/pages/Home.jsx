import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RIghtSidebar from '../components/RIghtSidebar'

const Home = () => {
  const [selectedUser, setselectedUser] = useState(false) // when user is not selected the chat container will not be visible
  return (
    <div>
         <div className ='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] x1:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
              <Sidebar selectedUser={selectedUser} setselectedUser={setselectedUser}/>
              <ChatContainer selectedUser={selectedUser} setselectedUser={setselectedUser}/>
              <RIghtSidebar selectedUser={selectedUser} setselectedUser={setselectedUser}/>
            </div>
         </div> 
    </div>
  )
}

export default Home