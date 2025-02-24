import React, { useState, useEffect } from "react";
import Table from "../components/ui/Table";
import { useParams } from "react-router";
import Header from "../components/header/Header";
import { Input } from "../components/ui/Input";

const OrderList = () => {
  const columns = [
    {
      key: "ltp",
      label: "LTP",
    },
    {
      key: "sellprice",
      label: "SELL PRICE",
    },

    {
      key: "sellqty",
      label: "SELL QTY",
    },
    {
      key: "ltq",
      label: "LTQ",
    },

    {
      key: "date",
      label: "Dates",
    },
    {
      key: "time",
      label: "Time",
    },
  ];

  const { id } = useParams();
  const [total, setTotal] = useState(0);
  const [interval, setInterval] = useState("");
  const [data, setData] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async ({ skip, limit }) => {
    try {
      const baseUrl = `${baseURL}/tickers/${id}?skip=${skip}&limit=${limit}`;
      const url = interval ? `${baseUrl}&interval=${interval}` : baseUrl;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setTotal(result.total);
      setData(result.ticker);

      return result.orders || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const resetFilter = () => {
    setInterval("");
    fetchData({ skip: 0, limit: 10 });
  };

  return (
    <div>
      <Header />
      <div className="px-10 bg-[#151515]">
        <div className="py-4 flex justify-center">
          <div className="text-3xl font-bold mb-4 w-[55%] flex justify-between">
            <h1>{data}</h1>
            <h1>History </h1>
          </div>
          <div className="flex items-center justify-end w-[45%]">
            <span className="font-semibold mr-4">Interval:</span>
            <Input
              type="number"
              value={interval}
              onChange={(e) =>
                setInterval(
                  e.target.value
                    ? Math.min(1000, Math.max(1, Number(e.target.value)))
                    : ""
                )
              }
              className="!w-full"
              variant="outline"
              min="1"
              max="1000"
            />
            <span className="">/min</span>
            <button
              onClick={resetFilter}
              className="ml-2 p-2 bg-red-500 text-white rounded"
            >
              Reset
            </button>
          </div>
        </div>
        <Table
          fetchData={fetchData}
          isBackendPagination={true}
          totalItems={total}
          columns={columns}
          itemsPerPage={10}
          searchable={false}
          selectable={false}
          exportable={false}
        />
      </div>
    </div>
  );
};

export default OrderList;
