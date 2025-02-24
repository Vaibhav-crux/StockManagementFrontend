import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../pages/Login";
import List from "../pages/List";
import OrderList from "../pages/OrderList";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import Portfolio from "../pages/Portfolio";
import UserOrders from "../pages/UserOrders";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <List />,
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Signup />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/portfolio",
        element: (
          <ProtectedRoute requireAuth={true}>
            <Portfolio />
          </ProtectedRoute>
        ),
      },
      {
        path: "/userorders",
        element: (
          <ProtectedRoute requireAuth={true}>
            <UserOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ticker/:id",
        element: <OrderList />,
      },
    ],
  },
]);

export default router;
