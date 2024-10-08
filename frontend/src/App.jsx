import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Component/Header';
import Footer from './Component/Footer';
import Cart from './Component/Cart';
import Advertisement from './Component/Advertisement';
import Review from './Component/Review';
import Information from './Component/Information';
import Login from './Buttons/Login';
import Signup from './Buttons/Signup';
import Help from './Buttons/Help';
import Chatboard from './Component/Chatboard';
import History from './Buttons/History';
import Signout from './Buttons/Signout';
import Profile from './Buttons/Profile';
import Tickets from './Buttons/Tickets';
import Explore from './Buttons/Explore'; 
import Theripest from './Component/Theripest';
import BookAppointment from './Component/BookAppointment';

const App = () => {
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setProfilePicture(null); // Clear profile picture
  };

  return (
    <Router>
      <Header profilePicture={profilePicture} /> {/* Pass profilePicture as prop */}
      <Routes>
        <Route path="/" element={<><Cart /><Advertisement /><Review /></>} />
        <Route path="/information" element={<Information />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/help" element={<Help />} />
        <Route path="/history" element={<History />} />
        <Route 
          path="/signout" 
          element={<Signout onSignOut={handleLogout} />} // Pass handleLogout as prop
        />
        <Route path="/profile" element={<Profile setProfilePicture={setProfilePicture} />} /> {/* Pass setter function */}
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/services" element={<Explore />} />
        <Route path="/theripest" element={<Theripest />} />
        <Route path="/book-appointment/:id" element={<BookAppointment />} />
      </Routes>
      <Chatboard />
      <Footer />
    </Router>
  );
}

export default App;