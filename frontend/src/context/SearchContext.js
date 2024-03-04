import { createContext, useContext, useEffect, useState } from "react";

const SearchAuthContext = createContext();
export const useSearchContext = () => useContext(SearchAuthContext);

function SearchContext({ children }) {
  const [auth, setAuth] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchAuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </SearchAuthContext.Provider>
  );
}

export default SearchContext;
