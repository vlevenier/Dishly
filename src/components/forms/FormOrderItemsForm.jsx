import { Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function OrderItemsForm({ items, onChange }) {

  const [editingItem, setEditingItem] = useState({
    product_id: "",
    variant_id: "",
    quantity: 1,
    unit_price: 0,
    subtotal: 0,
    notes: "",
  });

  const updateSubtotal = (quantity, unit_price) => {
    return (quantity * unit_price) || 0;
  };

  const handleAddItem = () => {
    const newItem = {
      ...editingItem,
      subtotal: updateSubtotal(editingItem.quantity, editingItem.unit_price)
    };

    onChange([...items, newItem]);

    setEditingItem({
      product_id: "",
      variant_id: "",
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
      notes: "",
    });
  };

  const handleDelete = (index) => {
    const newList = [...items];
    newList.splice(index, 1);
    onChange(newList);
  };

  return (
    <>
      <h4 className="mt-4">Items</h4>

      {items.map((item, i) => (
        <div key={i} className="p-2 border rounded mb-2 d-flex justify-content-between">
          <div>
            Producto: {item.product_id} <br />
            Variant: {item.variant_id} <br />
            Cantidad: {item.quantity} <br />
            Precio: {item.unit_price} <br />
            Subtotal: {item.subtotal}
          </div>
          <Button variant="danger" size="sm" onClick={() => handleDelete(i)}>
            Eliminar
          </Button>
        </div>
      ))}

      <h5 className="mt-3">Agregar Item</h5>

      <Form.Group className="mb-2">
        <Form.Label>ID Producto</Form.Label>
        <Form.Control
          type="number"
          value={editingItem.product_id}
          onChange={(e) =>
            setEditingItem({ ...editingItem, product_id: e.target.value })
          }
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>ID Variante</Form.Label>
        <Form.Control
          type="number"
          value={editingItem.variant_id}
          onChange={(e) =>
            setEditingItem({ ...editingItem, variant_id: e.target.value })
          }
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Cantidad</Form.Label>
        <Form.Control
          type="number"
          value={editingItem.quantity}
          onChange={(e) =>
            setEditingItem({
              ...editingItem,
              quantity: parseInt(e.target.value),
              subtotal: updateSubtotal(
                parseInt(e.target.value),
                editingItem.unit_price
              ),
            })
          }
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Precio Unitario</Form.Label>
        <Form.Control
          type="number"
          value={editingItem.unit_price}
          onChange={(e) =>
            setEditingItem({
              ...editingItem,
              unit_price: parseFloat(e.target.value),
              subtotal: updateSubtotal(
                editingItem.quantity,
                parseFloat(e.target.value)
              ),
            })
          }
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Notas</Form.Label>
        <Form.Control
          type="text"
          value={editingItem.notes}
          onChange={(e) =>
            setEditingItem({ ...editingItem, notes: e.target.value })
          }
        />
      </Form.Group>

      <Button variant="success" onClick={handleAddItem}>
        Agregar Item
      </Button>
    </>
  );
}
