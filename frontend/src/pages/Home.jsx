import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import { Link, useNavigate } from 'react-router-dom' 
import './Home.css'
import { apiHello } from '../components/api'
import { fetchToken, logout } from "../components/auth";

function Home() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  
  const setCountFunc = () => {
    setCount(count + 1);
  }

  const logoutFunc = async () => {
      await logout();
      navigate('/');
  }

  const fetchData = async () => {
    const data = await apiHello()
    setData(data)
  }

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <>
      <div>
        {/* <a href="https://vite.dev" target="_blank">W
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a> */}
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="login-link">
        {
                fetchToken() ? (<>
                <p>you are logged in</p>
                <button onClick={logoutFunc}>Logout</button>
                </>
              ) 
              : 
              <></>
          }
      </div>
      <div className="card">
        <button onClick={setCountFunc}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>{import.meta.env.MODE}</p>
      <h2>
        {data ? data.message : 'Loading...'}
      </h2>
    </>
  )
}

export default Home
