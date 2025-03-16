import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { fetchToken, login, logout } from "./components/auth";
import logo from './assets/logo.png'
export default function Login() {
    const navigate = useNavigate();
    const token = fetchToken();

    const loginFunc = async () => {
      await login();
      navigate('/');
    }

    return (
      <>
        <div>
            <a href="https://github.com/kstrassheim/fastapi-reference" target="_blank">
              <img src={logo} className="logo " alt="logo" />
            </a>
        </div>
        <h1>Login to FastAPI-Reference</h1>
        <p>Just press the button to automatically logon without any forms</p>
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
  