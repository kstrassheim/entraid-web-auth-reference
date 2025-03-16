import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import { RequireToken, setToken } from "./components/auth";
import Login from './Login';
import Home from './pages/Home';  
import NotFound from './404';
import './App.css'

function App() {
  return (
    <>
      <div className ="App">
        <Routes>
          <Route path="/" element = {<RequireToken><Home/></RequireToken>}/>
          <Route path="/login" element = {<Login/>}/>
          <Route path="*" element = {<NotFound/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
