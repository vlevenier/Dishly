import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useModal } from "../../context/ModalContext";
// import { saveVariantRecipe } from "../../services/ProductRecipes";
import { getIngredients } from "../../services/Ingredients";

export default function FormProductRecipe({ variant, onSave }) {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      recipes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipes",
  });

  const recipesWatch = watch("recipes");

  // Cargar ingredientes para el select
  useEffect(() => {
    const fetchIngredients = async () => {
      const list = await getIngredients();
      setIngredients(list);
    };
    fetchIngredients();
  }, []);

  // Cargar recetas existentes de la variante
useEffect(() => {
  if (variant?.recipes && ingredients.length > 0) {
    const formatted = variant.recipes.map((r) => ({
      ...r,
      ingredient_id: String(r.ingredient_id),
      unit: r.unit || r.ingredient_base_unit || "",
      quantity: r.display_quantity || r.quantity_base_per_unit,
    }));

    reset({ recipes: formatted });
  }
}, [variant, ingredients, reset]); // 👈 añadimos ingredients como dependencia

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formattedRecipes = data.recipes.map((r) => {
        const ing = ingredients.find((i) => i.id == r.ingredient_id);

        const selectedUnit = ing?.units.find(
          (u) => u.unit_name === r.unit
        ) || { ratio_to_base: 1 };

        const quantity_base_per_unit =
          Number(r.quantity) * Number(selectedUnit.ratio_to_base);

        return {
          ingredient_id: r.ingredient_id,
          quantity_base_per_unit,
        };
      });

      //await saveVariantRecipe(variant.id, formattedRecipes);

      onSave?.();
      closeModal();
    } catch (err) {
      console.error("Error guardando receta:", err);
      alert("Error guardando ingredientes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">
        Receta: {variant?.name}
      </h2>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {fields.length === 0 && (
          <p className="text-gray-500 text-sm mb-3">No hay ingredientes aún</p>
        )}

        {fields.map((field, index) => {
          const ingId = recipesWatch?.[index]?.ingredient_id;
          const selectedIng = ingredients.find((i) => i.id == ingId);

          return (
            <div
              key={field.id}
              className="p-2 border rounded mb-2 flex gap-2 items-end"
            >
              {/* INGREDIENTE */}
              <div className="flex-1">
                <Form.Label>Ingrediente *</Form.Label>
                <Form.Select
                  {...register(`recipes.${index}.ingredient_id`, {
                    required: true,
                  })}
                >
                  <option value="">Seleccione...</option>
                  {ingredients.map((ing) => (
                  <option key={ing.id} value={String(ing.id)}>

                      {ing.name}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* CANTIDAD */}
              <div className="w-32">
                <Form.Label>Cantidad *</Form.Label>
                <Form.Control
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...register(`recipes.${index}.quantity`, {
                    required: true,
                  })}
                />
              </div>

              {/* UNIDAD */}
              <div className="w-32">
                <Form.Label>Unidad *</Form.Label>
             <Form.Select {...register(`recipes.${index}.unit`, { required: true })}>
  {selectedIng && (
    <>
      {/* SIEMPRE incluimos la unidad base */}
      <option value={selectedIng.base_unit}>
        {selectedIng.base_unit}
      </option>

      {/* Luego todas las unidades, evitando repetir la base */}
      {selectedIng.units
        ?.filter(u => u.unit_name !== selectedIng.base_unit)
        .map(u => (
          <option key={u.id} value={u.unit_name}>
            {u.unit_name}
          </option>
        ))}
    </>
  )}
</Form.Select>

              </div>

              {/* Eliminar */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => remove(index)}
              >
                X
              </Button>
            </div>
          );
        })}

        <Button
          variant="success"
          className="mb-3"
          size="sm"
          onClick={() => append({ ingredient_id: "", quantity: 1 })}
        >
          + Agregar ingrediente
        </Button>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={closeModal} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar receta"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
