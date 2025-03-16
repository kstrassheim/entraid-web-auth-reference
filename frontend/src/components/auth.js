import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { backendUrl } from "./api"

export const setToken = (token) => {
    console.log(token, "setToken");
    localStorage.setItem('mytoken', token) // make up your own token
}

export const clearToken = () => {
    localStorage.removeItem('mytoken');
  };

export const fetchToken = () => {
    let token = localStorage.getItem('mytoken')
    console.log(token, "fetchToken");
    return token
}

export const RequireToken = ({children}) =>{
    const auth = fetchToken()
    const location = useLocation()
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth) {
          navigate("/login", { state: { from: location } });
        }
      }, [auth, navigate, location]);

    return children;
};

export const login = async () => {
    try {
      //const navigate = useNavigate();
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "login attempt" }),
      });

      if (!response.ok) { throw new Error("Network response was not ok"); }

      const data = await response.json();
      console.log(data.token, "data.token");
      if (data.token) {
        setToken(data.token);
        //navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  
export const logout = async () => {
    try {
      //const navigate = useNavigate();
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) { throw new Error("Network response was not ok"); }

      const data = await response.json();
      console.log(data.message);
      clearToken();
      //navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

