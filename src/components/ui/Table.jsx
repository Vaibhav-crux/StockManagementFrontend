import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Download,
  MoreHorizontal,
  Search,
  Settings,
  Loader2,
} from "lucide-react";

export default function Table({
  data = [],
  fetchData,
  isBackendPagination = false,
  totalItems = 0,
  columns = [],
  itemsPerPage = 10,
  searchable = true,
  selectable = true,
  exportable = true,
  onRowClick,
}) {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(columns.map((col) => col.key))
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState(data);

  // Backend pagination
  useEffect(() => {
    if (isBackendPagination && fetchData) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const skip = (currentPage - 1) * itemsPerPage;
          const result = await fetchData({
            skip,
            limit: itemsPerPage,
          });
          setTableData(result);
        } catch (err) {
          setError(err.message || "Failed to fetch data");
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [currentPage, itemsPerPage, isBackendPagination, fetchData]);

  // Frontend pagination and sorting logic
  const processedData = useMemo(() => {
    if (isBackendPagination) return tableData;

    let processedItems = [...data];

    // Sorting
    if (sortConfig.key && sortConfig.direction) {
      processedItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    // Filtering
    if (searchQuery) {
      processedItems = processedItems.filter((item) =>
        Object.entries(item).some(([key, value]) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return processedItems;
  }, [data, sortConfig, searchQuery, isBackendPagination, tableData]);

  // Pagination calculation
  const totalPages = isBackendPagination
    ? Math.ceil(totalItems / itemsPerPage)
    : Math.ceil(processedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    if (isBackendPagination) return tableData;

    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [
    processedData,
    currentPage,
    itemsPerPage,
    isBackendPagination,
    tableData,
  ]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Event handlers
  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)));
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleExport = () => {
    const dataToExport = isBackendPagination ? tableData : processedData;
    const csvContent = [
      columns
        .filter((col) => visibleColumns.has(col.key))
        .map((col) => col.label),
      ...dataToExport.map((row) =>
        columns
          .filter((col) => visibleColumns.has(col.key))
          .map((col) => String(row[col.key]))
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table-export.csv";
    link.click();
  };

  const toggleColumnVisibility = (key) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleColumns(newVisible);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table Controls */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-md border border-gray-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="flex items-center gap-2 w-full justify-end">
          {exportable && (
            <button
              onClick={handleExport}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Settings className="h-4 w-4" />
              Columns
            </button>
            {isSettingsOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                {columns.map((column) => (
                  <label
                    key={column.key}
                    className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(column.key)}
                      onChange={() => toggleColumnVisibility(column.key)}
                      className="mr-2 rounded border-gray-300"
                    />
                    {column.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              {selectable && (
                <th className="w-8 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns
                .filter((column) => visibleColumns.has(column.key))
                .map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3"
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${
                              sortConfig.key === column.key &&
                              sortConfig.direction === "ascending"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 ${
                              sortConfig.key === column.key &&
                              sortConfig.direction === "descending"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              <th className="w-8 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-black/95">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 2 : 1)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {isLoading ? "Loading..." : "No results found"}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={`group transition-colors hover:bg-white/20   ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {selectable && (
                    <td className="w-8 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => handleSelectRow(index)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  {columns
                    .filter((column) => visibleColumns.has(column.key))
                    .map((column) => (
                      <td key={column.key} className="px-4 py-3 ">
                        {row[column.key]}
                      </td>
                    ))}
                  <td className="w-8 px-4 py-3">
                    <button className="invisible rounded p-1 hover:bg-gray-100 group-hover:visible">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Showing{" "}
          {Math.min(
            (currentPage - 1) * itemsPerPage + 1,
            isBackendPagination ? totalItems : processedData.length
          )}{" "}
          to{" "}
          {Math.min(
            currentPage * itemsPerPage,
            isBackendPagination ? totalItems : processedData.length
          )}{" "}
          of {isBackendPagination ? totalItems : processedData.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
            className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
            className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
