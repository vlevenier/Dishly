import React from "react";
import DataTable from "../ui/DataTable";

export default function OrdersTable({ orders,onEdit }) {
const columns = [
  {
    header: "N° Pedido",
    accessor: "order_number",
  },
  {
    header: "Productos",
    accessor: "items_preview",
    render: (items, row) => {
      if (!items || items.length === 0) return "—";

      const firstItems = items.slice(0, 2)
        .map(i => `${i.name} x${i.quantity}`)
        .join(", ");

      const extra = row.items_count - items.length;

      return extra > 0 
        ? `${firstItems} (+${extra})`
        : firstItems;
    }
  },
  {
    header: "Total",
    accessor: "total",
    sortable: true,
    render: (v) => "$" + Number(v).toLocaleString(),
  },
  {
    header: "Estado",
    accessor: "status",
  },
  {
    header: "Pago",
    accessor: "payment_status",
  },
  {
    header: "Método Pago",
    accessor: "payment_method",
  },
  {
    header: "Fecha",
    accessor: "created_at",
    sortable: true,
    render: (v) => new Date(v).toLocaleDateString(),
  },
  {
    header: "Origen",
    accessor: "source",
  },
];

  return (
    <DataTable
      columns={columns}
      data={orders}
      renderActions={(row) => (
        <>
       

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
