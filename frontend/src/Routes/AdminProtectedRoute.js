// ⁡⁢⁢⁣//  it is adminRoute according to the Video ⁡

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthFile";
import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";

function AdminProtectedRoute() {
  const [ok, setOk] = useState(false);
  const { auth, SetAuth } = useAuthContext();

  const authCheck = async () => {
    const res = await axios.get("/api/v1/auth/admin-auth");

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

export default AdminProtectedRoute;
