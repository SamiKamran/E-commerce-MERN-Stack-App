import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import AdminMenu from "../components/layout/AdminMenu";
import { Select } from "antd";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthFile";
const { Option } = Select;
function AdminOrder() {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");

  const { auth, setAuth } = useAuthContext();
  const [orders, setOders] = useState([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`/api/v1/auth/orders`);
      console.log(data);
      setOders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
      toast.success(`Update Status Successfully!`);
    } catch (error) {}
  };

  return (
    <div className="row dashboard">
      <div className="col-md-3">
        <AdminMenu />
      </div>

      <div className="col-md-9">
        <h1 className="text-center">Orders </h1>

        <div className="container">
          {orders?.map((o, i) => {
            return (
              <div key={o._id} className="border shadow">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o?._id, value)}
                          defaultValue={o?.status}
                        >
                          {status?.map((s, i) => {
                            return (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            );
                          })}
                        </Select>
                      </td>
                      <td>{o?.buyer.name}</td>
                      <td>{moment(o?.createAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container">
                  {o?.products?.map((p, i) => (
                    <div className="row mb-2 p-3 card flex-row" key={p._id}>
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          width="250px"
                          height={"250px"}
                        />
                      </div>
                      <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>{p.description.substring(0, 30)}</p>
                        <p>Price : {p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminOrder;
