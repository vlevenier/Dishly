import { Edit2, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onToggleActive,
  onOpenVariantRecipes
}) {
  const [openVariants, setOpenVariants] = useState({});

  const toggleVariants = (productId) => {
    setOpenVariants({
      ...openVariants,
      [productId]: !openVariants[productId],
    });
  };

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
        >
          {/* Producto principal */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {p.name}
                {p.is_combo && (
                  <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                    Combo
                  </span>
                )}
              </h2>

              <p className="text-sm text-gray-600">
                Categoría: {p.category_name}
              </p>

              <p className="text-sm text-gray-600">
                Precio base: ${p.base_price}
              </p>

              {!p.active && (
                <span className="text-xs bg-red-200 px-2 py-1 rounded mt-1 inline-block">
                  Inactivo
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {/* Editar */}
              <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={() => onEdit(p)}
              >
                <Edit2 size={18} />
              </button>

              {/* Activar / Desactivar */}
              <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={() => onToggleActive(p)}
              >
                {p.active ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {/* Eliminar */}
              <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={() => onDelete(p)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Variantes */}
          {p.variants && p.variants.length > 0 && (
            <>
              <button
                className="mt-3 text-sm flex items-center gap-1 text-blue-600"
                onClick={() => toggleVariants(p.id)}
              >
                {openVariants[p.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                Ver Variantes ({p.variants.length})
              </button>

       {openVariants[p.id] && (
  <div className="ml-6 mt-2 space-y-2">
    {p.variants.map((v) => (
      <div
        key={v.id}
        className="p-2 bg-gray-50 border rounded"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">
            {v.name} — ${v.price_modifier}
          </span>

          {!v.active && (
            <span className="text-xs bg-red-200 px-2 py-1 rounded">
              Inactivo
            </span>
          )}
        </div>

        {/* 🔹 Recetas / Ingredientes */}
        {v.recipes && v.recipes.length > 0 ? (
          <ul className="ml-4 mt-2 text-sm list-disc text-gray-700 space-y-1">
            {v.recipes.map((r) => (
              <li key={r.id}>
                {r.ingredient_name} — {r.quantity_base_per_unit}
              </li>
            ))}
          </ul>
        ) : (
          <p className="ml-4 mt-2 text-xs text-gray-400 italic">
            No tiene ingredientes configurados
          </p>
        )}

        <button
          className="mt-2 text-xs text-blue-600 hover:underline"
          onClick={() => onOpenVariantRecipes(v)}
        >
         Ingredientes
        </button>

      </div>
    ))}
  </div>
)}

            </>
          )}
        </div>
      ))}
    </div>
  );
}
