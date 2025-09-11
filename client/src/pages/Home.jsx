import React, { useContext } from 'react'; // Import useContext
import Sidebar from '../components/Sidebar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import RightSidebar from '../components/RightSidebar.jsx'; // Corrected import name
import { ChatContext } from '../../context/ChatContext.jsx'; // Import the context

const Home = () => {
    // Get selectedUser from the ChatContext instead of local state
    const { selectedUser } = useContext(ChatContext);

    return (
        <div>
            <div className='border w-full h-screen sm:px-[10%] sm:py-[5%]'>
                {/* The layout logic now correctly uses the selectedUser from the context.
                  - When a user IS selected, we use a 3-column grid on medium screens and up.
                  - When a user IS NOT selected, ChatContainer will show the welcome screen and RightSidebar will not render, effectively creating a 2-pane view.
                */}
                <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 md:grid-cols-[1fr_2fr] ${
                    selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-[1fr_2fr]'
                }`}>
                    <Sidebar />
                    <ChatContainer />
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

export default Home;