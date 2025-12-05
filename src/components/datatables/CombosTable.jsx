import React from "react";
import DataTable from "../ui/DataTable";

export default function CombosTable({ combos, loading, onEdit }) {
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "name" },
    {
      header: "Precio",
      accessor: "base_price",
      render: (v) => "$" + Number(v).toLocaleString(),
    },
    {
      header: "Items",
      accessor: "items",
      render: (items) =>
        Array.isArray(items) && items.length > 0
          ? items
              .map((i) => `${i.product?.name ?? "Producto"} x${i.quantity}`)
              .join(", ")
          : "—",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={combos}
      loading={loading}
      renderActions={(row) => (
        <button
          className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
          onClick={() => onEdit(row)}
        >
          Editar
        </button>
      )}
    />
  );
}
