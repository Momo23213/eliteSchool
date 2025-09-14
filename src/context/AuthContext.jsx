import { createContext, useContext, useState } from "react";
import { userService } from "../services/userService";



const AuthContext = createContext(undefined);

export function AuthProvider( { children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  // 🔹 Fonction de connexion
  const login = async (email, password) => {
    try {
      const data = await userService.login({ email, password });
      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    } catch {
      throw new Error("Identifiants invalides");
    }
  };

  // 🔹 Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}