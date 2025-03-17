import { useState, useEffect } from 'react'
import './Home.css'
import { apiHello, getToken } from '../components/api'
import { useMsal } from '@azure/msal-react';
import {env} from '../config'

const Home = () => {
  const { instance } = useMsal()
  const [data, setData] = useState(null)

  const fetchData = async () => {
    const token = await getToken(instance);
    const result = await apiHello(token)
    setData(result)
  }

  useEffect(() => { fetchData() }, [])

  return (
    <>
      <div>
        <p>Environment:{env}</p>
        <h2>{data ? data.message : 'Loading...'}</h2>
        <button onClick={fetchData}>Reload Data</button>
        <p className="read-the-docs">
          Click on the Logo to learn more
        </p>
      </div>
    </>
  )
}

export default Home
