import { useState, useEffect, useRef } from 'react'
import './Home.css'
import { getUserData } from '../components/api'
import { useMsal } from '@azure/msal-react';
import {env} from '../config'
import appInsights from '../components/appInsights';

const Home = () => {
  const { instance } = useMsal();
  const [data, setData] = useState(null);
  const initFetchCompleted = useRef(false);

  const fetchData = async () => {
    const result = await getUserData(instance);
    setData(result)
  }

  useEffect(() => { 
    if (!initFetchCompleted.current) {
      appInsights.trackEvent({ name: 'Home - Fetch data started' });
      fetchData();
      appInsights.trackEvent({ name: 'Home - Fetch data completed' });
      initFetchCompleted.current = true;
    }
  }, [])

  return (
    <>
      <div>
        <h1>Home Page</h1>
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
