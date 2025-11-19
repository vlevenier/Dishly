import React, { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useModal } from "../context/ModalContext";
import FormEditCategory from "./forms/FormCategoriesEdit";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/Categories";
import toast from "react-hot-toast";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const { showModal, closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    getAndSetCategories();
  }, []);


  const getAndSetCategories = async () => {
  const list = await getCategories();
  setCategories(list);
};

 
  const handleOpenModal = (category = null) => {
    setEditingCategory(category);

    showModal(
      <FormEditCategory 
        category={category}
        onSave={handleSaveCategory}
        onCancel={() => { closeModal(); setEditingCategory(null); }}
        isSubmitting={isSaving}
      />
    );
  };


 const handleSaveCategory = async (data) => {
  setIsSaving(true);
  try {
    if (editingCategory)
      await updateCategory(editingCategory.id, data);    
    else 
      await createCategory(data);

    toast.success(editingCategory ? "Categoría actualizada" : "Categoría creada");

    await getAndSetCategories(); // 🔥 sync 100% con backend

    closeModal();
    setEditingCategory(null);
  } 
  catch (error) {
    toast.error("Error al guardar");
  } 
  finally {
    setIsSaving(false);
  }
};

  const handleDelete = async (id) => {
  if (!confirm("¿Eliminar?")) return;

  try {
    await deleteCategory(id);
    await getAndSetCategories();
    toast.success("Eliminado");
  } catch (e) {
    toast.error("Error al eliminar");
  }
};

  const toggleActive = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

 
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">


      <button
        onClick={() => handleOpenModal()}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Crear
      </button>

      <div className="bg-white shadow sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las categorías de tu menú
          </p>
        </div>
      </div>


      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      
      <div className="px-4 space-y-3">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron categorías</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow p-4 flex gap-3"
            >
             
              <div className="flex-shrink-0">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

             
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">
                        Pos: {category.position}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          category.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.active ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleActive(category.id)}
                    className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 active:bg-gray-200"
                  >
                    {category.active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {category.active ? "Ocultar" : "Mostrar"}
                  </button>

                  <button
                    onClick={() => handleOpenModal(category)}
                    className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 active:bg-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg active:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    
      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center active:bg-blue-700 z-20"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
