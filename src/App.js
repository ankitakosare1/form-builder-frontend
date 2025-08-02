import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Signup from './Pages/Signup/Signup'
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import VerifyOtp from './Pages/VerifyOtp/VerifyOtp';
import CreateNewPassword from './Pages/CreateNewPassword/CreateNewPassword';
import Home from './Pages/Home/Home';
import FormBuilder from './Pages/FormBuilder/FormBuilder';
import FormViewer from './Components/FormViewer/FormViewer';
import ProjectDetails from './Pages/ProjectDetails/ProjectDetails';
import Profile from './Pages/Profile/Profile';
import Settings from './Pages/SettingsPage/SettingsPage';
import Projects from './Pages/Projects/Projects';
import AnalysisPage from './Pages/Analysis/Analysis';
import AnalysisProjects from './Pages/AnalysisProjects/AnalysisProjects'
import HomeFormAnalysisPage from './Pages/HomeFormAnalysisPage/HomeFormAnalysisPage'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/reset-password' element={<CreateNewPassword />} />
        <Route path='/home' element={<Home />} />
        <Route path='/create-form' element={<FormBuilder />}/>
        <Route path="/form/:shareLink" element={<FormViewer />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/analysis" element={<AnalysisProjects />} />
        <Route path="/analysis/:projectId" element={<AnalysisPage />} />
        <Route path="/form-analysis/:formId" element={<HomeFormAnalysisPage />} />
      </Routes>
      <ToastContainer position='top-center' autoClose={2000} />
    </>
  );
};

export default App

