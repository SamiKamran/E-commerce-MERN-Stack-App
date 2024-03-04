import React from "react";
import { useSearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchInput() {
  const { auth, setAuth } = useSearchContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${auth.keyword}`
      );
      setAuth({ ...auth, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={auth?.keyword}
          onChange={(e) => setAuth({ ...auth, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchInput;
