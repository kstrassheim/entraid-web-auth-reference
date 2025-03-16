import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import './Home.css'
import { apiHello } from '../components/api'
import AzureLogon from '../AzureLogon'
import { useMsal } from '@azure/msal-react';
import { loginRequest, getProfilePhoto } from '../components/azureAuth';

function Home() {
  // Azure Logon 
  const { instance } = useMsal();
  const [account, setAccount] = useState(instance.getActiveAccount());
  const activeAccount = instance.getActiveAccount();

  // photo url state
  const [photoUrl, setPhotoUrl] = useState(null);
  // API Data
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const data = await apiHello()
    setData(data)
  }

  const fetchProfilePhotoFunc = async () => {
    if (activeAccount) {
      let photoUrl = await getProfilePhoto(instance, activeAccount);
      setPhotoUrl(photoUrl);
    }
  }

  useEffect(() => {
    const currentAccount = instance.getActiveAccount();
    if (currentAccount && currentAccount !== account) {
      setAccount(currentAccount);
    }
  }, [instance, activeAccount ? activeAccount.name : null]);

  // get api data
  useEffect(() => { fetchProfilePhotoFunc(); }, [account]);

  // get profile image
  useEffect(() => { fetchData();  }, []);

  return (
    <>
      <div>
          <a href="https://github.com/kstrassheim/fastapi-reference" target="_blank">
            <img src={logo} className="logo " alt="logo" />
          </a>
      </div>
      <h1>Entra Auth Web Reference</h1>
      <AzureLogon />
      {activeAccount && (
        <div>
          <h2>{activeAccount.name}</h2>
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" style={{ width: '100px', borderRadius: '50%' }} />
          ) : (
            <p>No profile photo available</p>
          )}
        </div>
      )}
      <div className="card">
        
        <p>{import.meta.env.MODE}</p>
        <h2>
          {data ? data.message : 'Loading...'}
        </h2>

        <p className="read-the-docs">
          Click on the Logo to learn more
        </p>
      </div>
    </>
  )
}

export default Home
