import { useState, useEffect } from 'react'
import './Home.css'
import { apiHello } from '../components/api'
import { useMsal } from '@azure/msal-react';

const Home = () => {
  const { instance } = useMsal()
  const [data, setData] = useState(null)

  const fetchData = async () => {
    // instance.loginPopup({
    //   scopes: ["api://6a8e74ac-e0e1-429b-9ac1-8135042f973d/user_impersonation"],
    //   prompt: "consent"
    // })
    const account = instance.getActiveAccount()
    const tokenResponse = await instance.acquireTokenSilent({ 
      //authority: 'https://login.microsoftonline.com/1e1e851f-618f-40d4-9c2d-45355ad039a9/v2.0',
      scopes: ['api://6a8e74ac-e0e1-429b-9ac1-8135042f973d/user_impersonation'], 
      account: account,
    })
    const result = await apiHello(tokenResponse.accessToken)
    setData(result)
  }

  useEffect(() => { fetchData() }, [])

  return (
    <>
      <div>
        <p>{import.meta.env.MODE}</p>
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
