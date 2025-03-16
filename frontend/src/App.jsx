import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Profile from './components/Profile';  
import Home from './pages/Home';  
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [hello, setHello] = useState(null)
  const setCountFunc = () => {
    setCount(count + 1);
  }

  const apiHost= import.meta.env.MODE === 'production' ? '': 'http://localhost:8000';

  useEffect(() => {
    // Fetch JSON data from the API endpoint
    fetch(`${apiHost}/api/hello`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setHello(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array runs this effect once on mount

  return (
    <>
      <div className ="App">
        <Routes>
          <Route path="/" element = {<Login/>}/>
          <Route path="/profile" element = {<Profile/>}/>
          <Route path="/home" element = {<Home/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
