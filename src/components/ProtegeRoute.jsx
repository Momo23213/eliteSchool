
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const PrivateRoute= ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    // Non connecté → redirect login
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Connecté mais rôle non autorisé → redirect dashboard selon rôle
    const redirect = user.role === "admin" ? "/admin/dashboard" :
                     user.role === "enseignant" ? "/teacher/dashboard" :
                     "/eleve/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default PrivateRoute;