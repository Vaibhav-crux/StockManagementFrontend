import React, { useState } from "react";
import Header from "../components/header/Header";
import Table from "../components/ui/Table";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const UserOrders = () => {
  const columns = [
    {
      key: "ticker", // Add the ticker field as the Symbol column
      label: "Symbol",
    },
    {
      key: "purchase_price",
      label: "Price",
    },
    {
      key: "purchase_qty",
      label: "Quantity",
    },
    {
      key: "timestamp",
      label: "Date/Time",
    },
  ];

  const qualityColumns = [
    { key: "description", label: "Description" },
    { key: "severity", label: "Severity" },
    { key: "timestamp", label: "Date / Time" },
  ];

  const { token } = useAuth();
  const [total, setTotal] = useState(0);
  const [showQualityTable, setShowQualityTable] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const fetchData = async ({ skip, limit }) => {
    try {
      const url = `${baseURL}/orders/purchased?skip=${skip}&limit=${limit}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedOrders = response.data.orders.map((order) => ({
        ...order,
        timestamp: formatTimestamp(order.timestamp),
      }));

      setTotal(response.data.total);
      return formattedOrders || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchCheckData = async ({ skip, limit }) => {
    try {
      const url = `${baseURL}/quality-checks?skip=${skip}&limit=${limit}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedOrders = response.data.issues.map((order) => ({
        ...order,
        timestamp: formatTimestamp(order.timestamp),
      }));

      setTotal(response.data.total_issues);
      return formattedOrders || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const handleToggleTable = () => {
    setShowQualityTable((prev) => !prev);
  };

  return (
    <div>
      <Header />
      <div className="py-4 flex justify-between items-center">
        <div className="w-[55%]">
          <h1 className="text-3xl font-bold mb-4 text-end">
            {showQualityTable ? "Quality Check Data" : "Orders"}
          </h1>
        </div>
        <div>
          <button
            type="button"
            onClick={handleToggleTable}
            className="bg-blue-500 rounded-lg py-2 px-3 shadow-2xl cursor-pointer shadow-blue-500 text-sm *:font-semibold"
          >
            {showQualityTable ? "Show Orders" : "Quality Check"}
          </button>
        </div>
      </div>
      <Table
        fetchData={showQualityTable ? fetchCheckData : fetchData}
        isBackendPagination={true}
        totalItems={total}
        columns={showQualityTable ? qualityColumns : columns}
        itemsPerPage={10}
        searchable={true}
        selectable={false}
        exportable={false}
      />
    </div>
  );
};

export default UserOrders;