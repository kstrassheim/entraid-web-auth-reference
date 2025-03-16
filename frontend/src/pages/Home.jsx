import { useState, useEffect } from 'react'
import './Home.css'
import { apiHello } from '../components/api'
function Home() {

  // API Data
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const data = await apiHello()
    setData(data)
  }

  // get profile image
  useEffect(() => { fetchData();  }, []);

  return (
    <>
      <div>
        
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
