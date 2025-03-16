import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './pages/Home';  
import './App.css'

function App() {
  return (
    <>
      <div className ="App">
        <Routes>
          <Route path="/" element = {<Home/>}/>
          <Route path="/login" element = {<Login/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
