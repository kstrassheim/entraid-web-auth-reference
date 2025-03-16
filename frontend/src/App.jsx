import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import { RequireToken } from "./components/auth";
import Login from './Login';
import Home from './pages/Home';  
import './App.css'

function App() {
  return (
    <>
      <div className ="App">
        <Routes>
          <Route path="/" element = {<RequireToken><Home/></RequireToken>}/>
          <Route path="/login" element = {<Login/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
