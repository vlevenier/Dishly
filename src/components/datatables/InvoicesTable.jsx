import React from "react";
import DataTable from "../ui/DataTable";

export default function InvoicesTable({ invoices, onViewFile,onEdit }) {
  const columns = [
    {
      header: "Proveedor",
      accessor: "provider_id",
    },
    {
      header: "Monto",
      accessor: "amount",
      sortable: true,
      render: (v) => "$" + Number(v).toLocaleString(),
    },
    {
      header: "Fecha",
      accessor: "date",
      sortable: true,
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      header: "Descripción",
      accessor: "description",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={invoices}
      renderActions={(row) => (
        <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewFile(row.file_key);
          }}
          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700"
        >
          Ver PDF
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
          className="ml-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
        >
          Editar
        </button> 
        </>
      )}
    />
  );
}
