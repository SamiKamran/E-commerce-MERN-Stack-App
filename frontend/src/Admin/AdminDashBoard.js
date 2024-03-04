import React from "react";
import { useAuthContext } from "../context/AuthFile";
import AdminMenu from "../components/layout/AdminMenu";
import Layout from "../pages/Layout";

function AdminDashBoard() {
  const { auth } = useAuthContext();

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-4">
            <AdminMenu />
          </div>
          <div className="col-md-8">
            <div className="card w-75 p-3">
              <h4> Admin Name : {auth?.user?.name}</h4>
              <h4> Admin Email : {auth?.user?.email}</h4>
              <h6> Admin Contact : {auth?.user?.phone}</h6>

              <h6> Admin Address : {auth?.user?.address}</h6>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashBoard;
