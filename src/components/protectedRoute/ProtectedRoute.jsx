import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ requireAuth, children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (requireAuth && !isLoggedIn) {
    // If user is not authenticated, redirect to login & store last route
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!requireAuth && isLoggedIn && location.state?.from !== undefined) {
    // Allow redirection back to the intended route (e.g., /cart)
    return <Navigate to={location.state.from} replace />;
  }

  if (!requireAuth && isLoggedIn && location.pathname === "/login") {
    // If the user manually tries to visit /login, redirect them to "/"
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
