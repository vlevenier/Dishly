import React, { useEffect, useState, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useModal } from "../context/ModalContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/Products";
import FormEditProduct from "./forms/FormProductsEdit";
import toast from "react-hot-toast";

export default function ProductsAdmin() {
  const { showModal, closeModal } = useModal();

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const list = await getProducts();
      setProducts(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrado optimizado
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Guardado (crear / editar)
  const handleSaveProduct = async (data) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success("Producto actualizado");
      } else {
        await createProduct(data);
        toast.success("Producto creado");
      }

      await loadProducts();
      closeModal();
      setEditingProduct(null);
    } catch (error) {
      toast.error("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar
  const handleDelete = async (product) => {
    if (!confirm(`¿Eliminar producto "${product.name}"?`)) return;

    try {
      await deleteProduct(product.id);
      await loadProducts();
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar producto");
    }
  };

  // Activar / desactivar
  const handleToggleActive = async (product) => {
    try {
      await updateProduct(product.id, {
        ...product,
        active: !product.active,
      });

      await loadProducts();
      toast.success("Estado actualizado");
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    showModal(<FormEditProduct onSave={handleSaveProduct} />);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    showModal(
      <FormEditProduct product={product} onSave={handleSaveProduct} />
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={openCreateModal}
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          placeholder="Buscar productos..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No hay productos para mostrar
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="p-4 border rounded-lg bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {p.name}
                  {p.is_combo && (
                    <span className="text-sm px-2 py-1 bg-yellow-200 rounded">
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
                  className="p-2 rounded-lg bg-gray-100"
                  onClick={() => openEditModal(p)}
                >
                  <Edit2 size={18} />
                </button>

                {/* Activar / desactivar */}
                <button
                  className="p-2 rounded-lg bg-gray-100"
                  onClick={() => handleToggleActive(p)}
                >
                  {p.active ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {/* Eliminar */}
                <button
                  className="p-2 rounded-lg bg-gray-100"
                  onClick={() => handleDelete(p)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
