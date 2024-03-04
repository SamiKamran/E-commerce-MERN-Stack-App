import React, { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../pages/Layout";
import UserMenu from "../components/layout/UserMenu";
import { useAuthContext } from "../context/AuthFile";

const Profile = () => {
  const { auth, setAuth } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/auth/profile`, {
        name,
        email,
        password,
        phone,
        address,
      });

      if (data?.success) {
        toast.success("Profile Updated Successfully");
        setAuth({ ...auth, user: data?.updatedUser });

        // ...auth : previous value
        // and user: data?.updatedUser : update value mean updating like this

        // Getting the storage in which we have the token and all objects that we have passed while creating the login backend
        let ls = localStorage.getItem("auth");

        // Parsing in order for JavaScript to understand the code
        ls = JSON.parse(ls);


        // In the object, we have a property named "user"; we are updating it. I have created a profile update route for this.
        ls.user = data.updatedUser;

        // Storing in the browser's local storage
        localStorage.setItem("auth", JSON.stringify(ls));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Your Profile "}>
      <div className="container-fluid pt-5 mt-5">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div>
              <div className="form-container">
                <form onSubmit={handleSubmit}>
                  <h1 className="title">User Profile </h1>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nameInput"
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      placeholder="Enter Your Email "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="phoneInput"
                      placeholder="Enter Your Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="addresInput"
                      placeholder="Enter Your Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
