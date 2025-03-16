import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import './Home.css'

function Home() {
  const [count, setCount] = useState(0)
  const [hello, setHello] = useState(null)
  const setCountFunc = () => {
    setCount(count + 1);
  }

  const apiHost= import.meta.env.MODE === 'production' ? '': 'http://localhost:8000';

  useEffect(() => {
    // Fetch JSON data from the API endpoint
    fetch(`${apiHost}/api/hello`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setHello(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array runs this effect once on mount

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
        {hello ? hello.message : 'Loading...'}
      </h2>
    </>
  )
}

export default Home
