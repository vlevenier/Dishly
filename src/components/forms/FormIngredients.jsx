import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useModal } from "../../context/ModalContext";
import { createIngredient, updateIngredient } from "../../services/Ingredients";

export default function FormIngredients({ ingredient, onSave }) {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // useForm
  // -------------------------------
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      base_unit: "",
      is_active: true,
      units: []
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "units"
  });
  // -------------------------------
  // Set values when editing
  // -------------------------------
  useEffect(() => {
    if (ingredient) {
      reset({
        name: ingredient.name,
        base_unit: ingredient.base_unit,
        is_active: ingredient.is_active,
         units: ingredient.units || []

      });
    }
  }, [ingredient, reset]);

  // -------------------------------
  // Submit
  // -------------------------------
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let saved;

      if (ingredient?.id) {
        // UPDATE
        saved = await updateIngredient(ingredient.id, data);
      } else {
        // CREATE
        saved = await createIngredient( data);
      }

      reset();
      closeModal();
    } catch (err) {
      console.error("Error saving ingredient:", err);
      alert("Error al guardar el ingrediente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {ingredient ? "Editar Ingrediente" : "Nuevo Ingrediente"}
      </h2>

      <Form onSubmit={handleSubmit(onSubmit)}>

        {/* Nombre */}
        <Form.Group className="mb-3">
          <Form.Label>Nombre *</Form.Label>
          <Form.Control
            type="text"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <small className="text-danger">{errors.name.message}</small>}
        </Form.Group>

        {/* Unidad Base */}
        <Form.Group className="mb-3">
          <Form.Label>Unidad base *</Form.Label>
          <Form.Control
            type="text"
            placeholder="ej: gr, ml, unidad…"
            {...register("base_unit", { required: "La unidad base es obligatoria" })}
          />
          {errors.base_unit && (
            <small className="text-danger">{errors.base_unit.message}</small>
          )}
        </Form.Group>

        {/* Activado */}
        <Form.Group className="mb-3 d-flex align-items-center gap-2">
          <Form.Check
            type="checkbox"
            label="Ingrediente activo"
            {...register("is_active")}
          />
        </Form.Group>


          <div className="border p-3 rounded-lg mb-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Unidades adicionales</h3>
            <Button
              size="sm"
              onClick={() => append({ unit_name: "", ratio_to_base: 1 })}
            >
              + Agregar unidad
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-gray-500 text-sm">No hay unidades añadidas.</p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-2 mb-2 p-2 border rounded-md"
            >
              <div className="flex-1">
                <Form.Label>Unidad</Form.Label>
                <Form.Control
                  {...register(`units.${index}.unit_name`, {
                    required: "Requerido"
                  })}
                />
              </div>

              <div className="flex-1">
                <Form.Label>Ratio (x)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  step="0.01"
                  {...register(`units.${index}.ratio_to_base`, {
                    required: "Requerido",
                    min: { value: 0.01, message: "Debe ser mayor a 0" }
                  })}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  X
                </Button>
              </div>
            </div>
          ))}
        </div>



        {/* Footer */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => closeModal()} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading
              ? ingredient
                ? "Actualizando..."
                : "Creando..."
              : ingredient
              ? "Actualizar"
              : "Crear"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
