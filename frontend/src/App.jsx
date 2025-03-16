import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';  
import NotFound from './404';
import './App.css'

function App() {
  return (
    <>
      <div className ="App">
        <Routes>
          <Route path="/" element = {<Home/>}/>
          <Route path="*" element = {<NotFound/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
