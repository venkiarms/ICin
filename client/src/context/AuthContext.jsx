import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("auth")) || {
      username: null,
      email: null,
      role: null,
      token: null,
      rewardPoints: null,
    }
  ); //{username, email, role, token}

  const getUser = async () => {
    try {
      if (!auth.token) return;
      const response = await axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const updatedAuth = {
        ...auth,
        username: response.data.data.username,
        email: response.data.data.email,
        role: response.data.data.role,
        rewardPoints: response.data.data.rewardPoints,
      };

      if (
        updatedAuth.username !== auth.username ||
        updatedAuth.email !== auth.email ||
        updatedAuth.role !== auth.role ||
        updatedAuth.rewardPoints !== auth.rewardPoints
      ) {
        setAuth(updatedAuth);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
