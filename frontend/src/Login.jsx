import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { fetchToken, login, logout } from "./components/auth";
export default function Login() {
    const navigate = useNavigate();
    const token = fetchToken();

    const loginFunc = async () => {
      await login();
      navigate('/');
    }

    return (
      <>
        <h1>Login</h1>
        {
          token ? (<>
          <p>you are logged in</p>
          <Link to='/'>Goto Home</Link>
          </>
        ) 
        : 
        (
          <button onClick={loginFunc}>Login</button>
        )
        }
      </>
    );
  }
  