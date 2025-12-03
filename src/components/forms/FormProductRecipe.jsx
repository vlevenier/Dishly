import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useModal } from "../../context/ModalContext";
import { getIngredients } from "../../services/Ingredients";
import { createProductRecipe, deleteRecipeItem, updateProductRecipe } from "../../services/ProductRecipe";

export default function FormProductRecipe({ variant, onSave }) {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const { register, handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      recipes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipes",
  });

  const recipesWatch = watch("recipes");

  // 🔹 CARGAR INGREDIENTES
  useEffect(() => {
    const fetchIngredients = async () => {
      const list = await getIngredients();
      setIngredients(list || []);
    };
    fetchIngredients();
  }, []);

  // 🔹 CARGAR RECETAS EXISTENTES CUANDO YA ESTÉN LOS INGREDIENTES
  useEffect(() => {
    if (!variant?.recipes || ingredients.length === 0) return;

    const formatted = variant.recipes.map((r) => ({
      ingredient_id: String(r.ingredient_id),
      quantity_original: r.quantity_original || 1,
      ingredient_unit_id: r.ingredient_unit_id || null,
    }));

    reset({ recipes: formatted });
  }, [variant, ingredients, reset]);

  // ------------------------------------------------------------
  // 🔹 GUARDAR
  // ------------------------------------------------------------
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formattedRecipes = data.recipes.map((r) => ({
        ingredient_id: Number(r.ingredient_id),
        quantity_original: Number(r.quantity_original),
        ingredient_unit_id: r.ingredient_unit_id
          ? Number(r.ingredient_unit_id)
          : null,
      }));
      console.log("Recetas formateadas:", formattedRecipes);
         const response = await createProductRecipe(variant.id, formattedRecipes);
         console.log("Respuesta receta creada:", response);
      // await saveVariantRecipe(variant.id, formattedRecipes);
       console.log("Guardar receta:", variant.id, formattedRecipes);  
      onSave?.();
      closeModal();
    } catch (err) {
      console.error("Error guardando receta:", err);
      alert("Error guardando ingredientes");
    } finally {
      setLoading(false);
    }
  };


const onSubmit2 = async (data) => {
  try {
    setLoading(true);

    const current = data.recipes;           // lo que envía el form
    const original = variant.recipes || []; // lo que estaba antes

    const originalIds = original.map(r => r.id);
    const currentIds = current.filter(r => r.id).map(r => r.id);

    // ------------------------------------------------------------
    // 1) DELETE → eliminar los que ya no están
    // ------------------------------------------------------------
    const toDelete = originalIds.filter(id => !currentIds.includes(id));
    for (const id of toDelete) {
      await deleteRecipeItem(variant.id, id);
    }

    // ------------------------------------------------------------
    // 2) UPDATE → actualizar solo los existentes
    // ------------------------------------------------------------
    for (const r of current) {
      if (r.id) {
        const payload = {
          ingredient_id: Number(r.ingredient_id),
          quantity_original: Number(r.quantity_original),
          ingredient_unit_id: r.ingredient_unit_id
            ? Number(r.ingredient_unit_id)
            : null,
        };

        await updateProductRecipe(variant.id, r.id, payload);
      }
    }

    // ------------------------------------------------------------
    // 3) CREATE → enviar TODOS los nuevos en UN SOLO ARRAY
    // ------------------------------------------------------------
    const nuevos = current
      .filter(r => !r.id)
      .map(r => ({
        ingredient_id: Number(r.ingredient_id),
        quantity_original: Number(r.quantity_original),
        ingredient_unit_id: r.ingredient_unit_id
          ? Number(r.ingredient_unit_id)
          : null,
      }));

    if (nuevos.length > 0) {
      // 👈 una llamada, sin loops
      await createProductRecipe(variant.id, nuevos);
    }

    onSave?.();
    closeModal();

  } catch (err) {
    console.error("Error guardando receta:", err);
    alert("Error guardando ingredientes");
  } finally {
    setLoading(false);
  }
};

  // ------------------------------------------------------------
  // 🔹 RENDER
  // ------------------------------------------------------------
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">
        Receta: {variant?.name}
      </h2>

      <Form onSubmit={handleSubmit(onSubmit2)}>
        {fields.length === 0 && (
          <p className="text-gray-500 text-sm mb-3">
            No hay ingredientes aún
          </p>
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
                  {...register(`recipes.${index}.quantity_original`, {
                    required: true,
                  })}
                />
              </div>

              {/* UNIDAD */}
              <div className="w-40">
                <Form.Label>Unidad</Form.Label>
                <Form.Select
                  {...register(`recipes.${index}.ingredient_unit_id`)}
                >
                  {/* <option value="">Base por defecto</option> */}

                  {selectedIng &&
                    selectedIng.units?.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.unit_name} ({u.ratio_to_base} base)
                      </option>
                    ))}
                </Form.Select>
              </div>

              {/* ELIMINAR */}
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
          onClick={() =>
            append({
              ingredient_id: "",
              quantity_original: 1,
              ingredient_unit_id: "",
            })
          }
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
