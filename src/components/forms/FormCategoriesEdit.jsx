import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useModal } from "../../context/ModalContext";

export default function FormEditCategory({ category, onSave, onCancel, isSubmitting }) {

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    position: category?.position || "",
    image_url: category?.image_url || "",
    active: category?.active ?? true
  });

    useEffect(() => {
    setFormData({
      name: category?.name || "",
      description: category?.description || "",
      position: category?.position || "",
      image_url: category?.image_url || "",
      active: category?.active ?? true
    });
  }, [category])

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {category ? "Editar Categoría" : "Nueva Categoría"}
      </h2>

      <Form onSubmit={handleSubmit}>

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
          <Form.Label>Descripción *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Posición *</Form.Label>
          <Form.Control
            type="number"
            required
            min="1"
            value={formData.position}
            onChange={(e) =>
              setFormData({
                ...formData,
                position: parseInt(e.target.value) || ""
              })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL de Imagen</Form.Label>
          <Form.Control
            type="text"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex align-items-center gap-2">
          <Form.Check
            type="checkbox"
            label="Categoría activa"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
          />
        </Form.Group>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
  <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (category ? "Actualizando..." : "Creando...") : (category ? "Actualizar" : "Crear")}
          </Button>
        </div>

      </Form>
    </div>
  );
}
