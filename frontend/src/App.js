import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from "./components/MainPage";
import AppointmentPage from "./components/AppointmentPage";
import PetSelector from "./components/PetSelector";
import CancelAppointment from "./components/CancelAppointment";
import DogBodyMap from "./components/DogBodyMap";
import CatBodyMap from "./components/CatBodyMap";


const App = () => {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/appointment" element={<AppointmentPage/>}/>
                <Route path="/pet-info" element={<PetSelector/>}/>
                <Route path="/cancel-appointment" element={<CancelAppointment/>}/>
                <Route path="/dog-body-map" element={<DogBodyMap/>}/>
                <Route path="/cat-body-map" element={<CatBodyMap/>}/>


            </Routes>
        </Router>
    );
};

export default App;