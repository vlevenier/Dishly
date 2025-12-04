import React from "react";
import DataTable from "../ui/DataTable";

export default function IngredientsTable({ ingredients, onEdit, onDisable }) {
  const columns = [
    {
      header: "Nombre",
      accessor: "name",
      sortable: true,
    },
    {
      header: "Unidad base",
      accessor: "base_unit",
      sortable: true,
    },

    // ⭐ Nueva columna: Unidades Extras
    {
      header: "Unidades extra",
      accessor: "units",
      render: (units) => {
        if (!units || units.length === 0) return "—";

        return units
          .map((u) => `${u.unit_name} (x${u.ratio_to_base})`)
          .join(", ");
      },
    },

    {
      header: "Activo",
      accessor: "is_active",
      sortable: true,
      render: (v) => (v ? "Sí" : "No"),
    },
    {
      header: "Creado",
      accessor: "created_at",
      sortable: true,
      render: (v) => new Date(v).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={ingredients}
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

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDisable(row.id);
            }}
            className="ml-2 px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
          >
            Eliminar
          </button> 
        </>
      )}
    />
  );
}
