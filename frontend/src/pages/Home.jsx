import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom' 
import './Home.css'
import { apiHello } from '../components/api'
import { fetchToken, logout, login } from "../components/auth";

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
          <a href="https://github.com/kstrassheim/fastapi-reference" target="_blank">
            <img src={logo} className="logo " alt="logo" />
          </a>
      </div>
      <h1>FastAPI-Reference</h1>
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
        <p className="read-the-docs">
          Click on the Logo to learn more
        </p>
        <p>{import.meta.env.MODE}</p>
        <h2>
          {data ? data.message : 'Loading...'}
        </h2>
      </div>
    </>
  )
}

export default Home
