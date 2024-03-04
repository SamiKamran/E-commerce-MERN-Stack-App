import React from "react";
import { useSearchContext } from "../context/SearchContext";
import Layout from "./Layout";

function Search() {
  const { auth, setAuth } = useSearchContext();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <h6>
            {auth?.results.length < 1
              ? "No Product Found"
              : `Found ${auth?.results.length} `}
          </h6>
          <div className="d-flex  flex-wrap mt-4">
            {auth?.results?.map((p) => {
              return (
                <div
                  className="card m-2"
                  key={p._id}
                  style={{ width: "18rem" }}
                >
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                    <p className="card-text">${p.price}</p>
                    <p className="card-text">{p.slug}</p>
                    <button class="btn btn-primary ms-1">More Details</button>
                    <button class="btn btn-secondary ms-1">Add to Cart</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Search;
