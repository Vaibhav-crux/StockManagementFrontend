import React from "react";
import Header from "../components/header/Header";
import Table from "../components/ui/Table";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Portfolio = () => {
  const columns = [
    {
      key: "symbol",
      label: "Symbol",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "average_price",
      label: "Avg. Price",
    },
    {
      key: "current_price",
      label: "Current Price",
    },
    {
      key: "pnl",
      label: "PNL",
    },
    {
      key: "timestamp",
      label: "Date/Time",
    },
  ];
  const { token } = useAuth();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const fetchData = async ({ skip, limit }) => {
    try {
      const url = `${baseURL}/portfolio-position?skip=${skip}&limit=${limit}`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedOrders = response.data.positions.map((order) => ({
        ...order,
        timestamp: formatTimestamp(order.timestamp),
      }));

      return formattedOrders || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  return (
    <div>
      <Header />
      <div>
        <div className="py-4 flex justify-center">
          <h1 className="text-3xl font-bold mb-4 text-center">Portfolio </h1>
        </div>
        <Table
          fetchData={fetchData}
          isBackendPagination={true}
          totalItems={100}
          columns={columns}
          itemsPerPage={10}
          searchable={true}
          selectable={false}
          exportable={false}
        />
      </div>
    </div>
  );
};

export default Portfolio;
