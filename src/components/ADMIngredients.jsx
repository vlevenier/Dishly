import React, { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";

import { getIngredients } from "../services/Ingredients";
import IngredientsTable from "./datatables/IngredientsTable";
import FormIngredient from "./forms/FormIngredients"; // <-- este lo crearemos

export default function ADMIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const { showModal } = useModal();

  // ------------------------------------
  // Cargar ingredientes
  // ------------------------------------
  const loadIngredients = async () => {
    try {
      setLoading(true);
      const list = await getIngredients();
      setIngredients(list);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  // ------------------------------------
  // Abrir modal para crear/editar
  // ------------------------------------
  const openIngredientModal = (ingredient = null) => {
    showModal(
      <FormIngredient
        ingredient={ingredient}
        onSave={loadIngredients}
      />
    );
  };

  return (
    <div>
      <h1>Administración de Ingredientes</h1>

      <button onClick={() => openIngredientModal()}>
        Crear Ingrediente
      </button>

       <IngredientsTable
        ingredients={ingredients}
        onEdit={(ingredient) => openIngredientModal(ingredient)}
      /> 
    </div>
  );
}
