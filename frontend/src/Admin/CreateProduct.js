import React, { useEffect, useState } from "react";
import Layout from "../pages/Layout";
import AdminMenu from "../components/layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
const { Option } = Select;

function CreateProduct() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");



  const navigate = useNavigate();
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data.category);
        console.log("Categories:", categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error); // Log any errors
      toast.error("Something went wrong while fetching categories");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("shipping", shipping);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("photo", photo);
      const { data } = await axios.post(
        `/api/v1/product/create-product`,
        formData
      );
      if (data?.success) {
        toast.success("Product Created Successfully Today");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout title={"Dashboard Create Category"}>
      <div className="container-fluid mt-5 pt-4">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Product</h1>

            <Select
              variant="outlined" // Use variant instead of bordered
              placeholder="Select a Category"
              size="large"
              showSearch
              className="form-select mb-3"
              onChange={(value) => setCategory(value)}
              value={category}
            >
              {categories.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>

            <div className="mb-3">
              <label
                htmlFor="uploadImages"
                className="btn btn-outline-secondary col-md-12"
              >
                {photo ? photo.name : "Upload photo"}

                <input
                  type="file"
                  id="uploadImages"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>

            <div className="mb-3">
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="photo"
                    height={"300px"}
                    className="img img-responsive"
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="text"
                placeholder="write a Name"
                value={name}
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                name=""
                id=""
              />
            </div>

            <div className="mb-3">
              <textarea
                type="text"
                value={description}
                placeholder="write a description"
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                value={price}
                placeholder="write a Price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={quantity}
                placeholder="write a quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <Select
                bordered={false}
                placeholder="Select Shipping "
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setShipping(value);
                }}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>
            </div>

            <div className="mb-3">
              <button className="btn btn-primary" onClick={handleCreate}>
                CREATE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateProduct;
