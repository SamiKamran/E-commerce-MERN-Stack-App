// ⁡⁢⁢⁣//  it is protected Route according to the Video ⁡

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthFile";
import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";

function GrandPermissionPrivateRoute() {
  const [ok, setOk] = useState(false);
  const { auth, SetAuth } = useAuthContext();

  const authCheck = async () => {
    const res = await axios.get("/api/v1/auth/user-auth");

    console.log(res.data.ok);
    if (res.data.ok) {
      setOk(true);
    } else {
      setOk(false);
    }
  };
  useEffect(() => {
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}

export default GrandPermissionPrivateRoute;

// Initial Load:

// When the component mounts for the first time, the useEffect runs because of the empty dependency array, and it checks the auth?.token value.
// If auth?.token has a truthy value (meaning there is a token), it calls the authCheck function, making a request to the server to check if the user is authenticated.

// Subsequent Updates:

// If, during the component's lifecycle, the auth?.token value changes (e.g., user logs in or logs out), the useEffect will run again due to the change in the auth?.token dependency.
// It will then re-run the authCheck function, making a new request to the server if auth?.token is truthy.
