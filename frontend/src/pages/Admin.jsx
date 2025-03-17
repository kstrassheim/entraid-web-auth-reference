import { useState, useEffect, useRef } from 'react'
import './Home.css'
import { adminData, getToken } from '../components/api'
import { useMsal } from '@azure/msal-react';

const Admin = () => {
  const { instance } = useMsal()
  const [data, setData] = useState(null)
  const initFetchCompleted = useRef(false);

  const fetchData = async () => {
    const token = await getToken(instance);
    const result = await adminData(token)
    setData(result)
  }

  useEffect(() => { 
    if (!initFetchCompleted.current) {
      fetchData();
      initFetchCompleted.current = true;
    }
  }, [])

  return (
    <>
      <div>
        <h1>Admin Page</h1>
        <h2>{data ? data.message : 'Loading...'}</h2>
        <button onClick={fetchData}>Reload Data</button>
        <p className="read-the-docs">
          Click on the Logo to learn more
        </p>
      </div>
    </>
  )
}

export default Admin
