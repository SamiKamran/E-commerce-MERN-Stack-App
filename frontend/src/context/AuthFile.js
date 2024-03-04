import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

import React from "react";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

function AuthFile({ children }) {
  const [auth, SetAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);

      SetAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, SetAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthFile;




