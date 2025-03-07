import React from "react";
import { Outlet } from "react-router";

const App = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Outlet />
    </div>
  );
};

export default App;
