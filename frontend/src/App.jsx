import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';  
import NotFound from './404';
import logo from './assets/logo.png'
import './App.css'
import EntraLogon from './components/EntraLogon'
import EntraProfile from './components/EntraProfile'
import AccessDenied from './components/AccessDenied'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="https://github.com/kstrassheim/fastapi-reference" target="_blank">
            <img src={logo} className="logo " alt="logo" />
        </a>
        Entra Auth Web Reference
      </div>
      <ul className="navbar-links">
        <li>
          <EntraLogon />
        </li>
        <li>
          <EntraProfile />
        </li>
      </ul>
    </nav>
      <div className ="main-content">
        <Routes>
          <Route path="/" element = {<ProtectedRoute requiredRoles={[]}><Home/></ProtectedRoute>}/>
          <Route path="/access-denied" element = {<AccessDenied />}/>
          <Route path="*" element = {<NotFound/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
