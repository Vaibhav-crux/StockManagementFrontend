import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("authToken") ?? null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("isLoggedIn") === "true"
  );
  const authChannel = new BroadcastChannel("auth_channel");

  // Login function
  const login = (newToken) => {
    if (token === newToken) return; // Prevent unnecessary updates

    sessionStorage.setItem("authToken", newToken);
    sessionStorage.setItem("isLoggedIn", "true");

    setToken(newToken);
    setIsLoggedIn(true);

    authChannel.postMessage({ type: "LOGIN", token: newToken });
  };

  // Logout function
  const logout = () => {
    if (!token) return; // Prevent redundant logouts

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("isLoggedIn");

    setToken(null);
    setIsLoggedIn(false);

    authChannel.postMessage({ type: "LOGOUT" });
  };

  // Sync auth state across tabs in the same browser
  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.data.type === "LOGOUT") {
        logout();
      } else if (event.data.type === "LOGIN") {
        if (event.data.token !== token) {
          sessionStorage.setItem("authToken", event.data.token);
          sessionStorage.setItem("isLoggedIn", "true");
          setToken(event.data.token);
          setIsLoggedIn(true);
        }
      }
    };

    authChannel.addEventListener("message", handleAuthMessage);

    return () => authChannel.removeEventListener("message", handleAuthMessage);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
