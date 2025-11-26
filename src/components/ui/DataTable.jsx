import React from "react";
import { ArrowUpDown } from "lucide-react";

export default function DataTable({ columns, data, onRowClick, renderActions }) {
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: "asc" });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (col) => {
    if (!col.sortable) return;

    setSortConfig((prev) => ({
      key: col.accessor,
      direction:
        prev.key === col.accessor && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="w-full">
      {/* TABLE DESKTOP */}
      <div className="hidden md:block border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => handleSort(col)}
                  className={`p-3 font-medium ${
                    col.sortable ? "cursor-pointer hover:bg-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && <ArrowUpDown className="w-4 h-4 opacity-60" />}
                  </div>
                </th>
              ))}
              {renderActions && <th className="p-3">Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-gray-50 transition cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="p-3">
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
                {renderActions && <td className="p-3">{renderActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden flex flex-col gap-4">
        {sortedData.map((row) => (
          <div
            key={row.id}
            className="border rounded-xl p-4 shadow-sm bg-white"
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div key={col.accessor} className="flex justify-between py-1">
                <span className="font-semibold">{col.header}</span>
                <span>{col.render ? col.render(row[col.accessor], row) : row[col.accessor]}</span>
              </div>
            ))}

            {renderActions && (
              <div className="mt-3 flex justify-end gap-2">{renderActions(row)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
