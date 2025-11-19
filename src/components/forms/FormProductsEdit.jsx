import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useModal } from "../../context/ModalContext";

export default function FormProductEdit({ product, onSave }) {
  const { closeModal } = useModal();

  const [formData, setFormData] = useState({
    category_id: product?.category_id || "",
    name: product?.name || "",
    description: product?.description || "",
    base_price: product?.base_price || "0.00",
    image_url: product?.image_url || "",
    is_combo: product?.is_combo ?? false,
    active: product?.active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    closeModal();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {product ? "Editar Producto" : "Nuevo Producto"}
      </h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Categoría *</Form.Label>
          <Form.Control
            type="number"
            required
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nombre *</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio Base *</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            required
            value={formData.base_price}
            onChange={(e) =>
              setFormData({ ...formData, base_price: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL Imagen</Form.Label>
          <Form.Control
            type="url"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex gap-3">
          <Form.Check
            type="checkbox"
            label="Es Combo"
            checked={formData.is_combo}
            onChange={(e) =>
              setFormData({ ...formData, is_combo: e.target.checked })
            }
          />

          <Form.Check
            type="checkbox"
            label="Activo"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
          />
        </Form.Group>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>

          <Button variant="primary" type="submit">
            {product ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
