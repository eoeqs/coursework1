import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from "./components/MainPage";
import AppointmentPage from "./components/AppointmentPage";
import PetSelector from "./components/PetSelector";
import DogBodyMap from "./components/DogBodyMap";
import CatBodyMap from "./components/CatBodyMap";
import VetDashboard from "./components/VetDashboard";
import PetProfile from "./components/PetProfile";
import AnamnesisDetailsPage from "./components/AnamnesisDetailsPage";
import HealthUpdateDetailsModal from "./components/HealthUpdateDetailsModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import OwnerDashboard from "./components/OwnerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import QuarantineManagement from "./components/QuarantineManagement";
import SectorQuarantineManagement from "./components/SectorQuarantineManagement";
import MyPets from "./components/MyPets";
import MyWards from "./components/MyWards";
import AllPetOwners from "./components/AllPetOwners";
import AllVets from "./components/AllVets";
import AllPets from "./components/AllPets";
import SectorManagement from "./components/SectorManagement";


const App = () => {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/appointment" element={<AppointmentPage/>}/>
                <Route path="/pet-info" element={<PetSelector/>}/>
                <Route path="/dog-body-map" element={<DogBodyMap/>}/>
                <Route path="/cat-body-map" element={<CatBodyMap/>}/>
                <Route path="/vet-dashboard" element={<VetDashboard/>}/>
                <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                <Route path="/pet/:petId" element={<PetProfile/>} />
                <Route path="/anamnesis/:id" element={<AnamnesisDetailsPage />} />
                <Route path="/health/:id" element={<HealthUpdateDetailsModal />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/quarantine-management" element={<QuarantineManagement />} />
                <Route path="/quarantine/sector/:sectorId" element={<SectorQuarantineManagement />} />
                <Route path="/my-pets" element={<MyPets />} />
                <Route path="/my-wards" element={<MyWards />} />
                <Route path="/all-pets" element={<AllPets />} />
                <Route path="/all-vets" element={<AllVets />} />
                <Route path="/all-pet-owners" element={<AllPetOwners />} />
                <Route path="/sector-management" element={<SectorManagement />} />

            </Routes>
        </Router>
    );
};

export default App;