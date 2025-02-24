import { Link, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Trickers
      </h1>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <span className="text-lg font-semibold">Welcome, User</span>
            <Link to="/userorders" className=" px-4 py-2 rounded">
              Orders
            </Link>
            <Link to="/portfolio" className=" px-4 py-2 rounded">
              Portfolio
            </Link>

            <button onClick={handleLogout} className=" px-4 py-2 rounded">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className=" px-4 py-2 rounded">
            Login
          </Link>
        )}

        <Link to="/cart" className="relative   px-4 py-2 rounded">
          Cart ({cart.length})
        </Link>
      </div>
    </div>
  );
};

export default Header;
