import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Make sure to use named import

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken); // decode token
        const now = Math.floor(Date.now() / 1000); // current time in seconds

        if (decoded.exp && decoded.exp > now) {
          setUserToken(storedToken); // ✅ token is valid
        } else {
          // ❌ token is expired
          localStorage.removeItem("token");
          setUserToken(null);
        }
      } catch (error) {
        // ❌ invalid token format
        localStorage.removeItem("token");
        setUserToken(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
}