import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from "./components/MainPage";
import AppointmentPage from "./components/AppointmentPage";


const App = () => {
  const [user, setUser] = useState({roles: []});

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
      <Router>
        <Routes>
          <Route path="/main-page" element={<MainPage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/appointment" element={<AppointmentPage/>}/>
        </Routes>
      </Router>
  );
};

export default App;