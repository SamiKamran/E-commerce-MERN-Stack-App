import React from "react";
import { useAuthContext } from "../context/AuthFile";
import Layout from "../pages/Layout";
import UserMenu from "../components/layout/UserMenu";

function DashBoard() {
  const { auth } = useAuthContext();
  return (
    <Layout title={"DashBoard - Ecommerce App"}>
      <div className="container-fluid pt-5 mt-5">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3> {auth?.user?.name}</h3>
              <h3> {auth?.user?.email}</h3>
              <h3> {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashBoard;
