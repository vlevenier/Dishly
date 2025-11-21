import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

export default function FormOrder({ order, products, onSave, onCancel, isSubmitting }) {

const [formData, setFormData] = useState({
status: order?.status || "",
payment_status: order?.payment_status || "",
payment_method: order?.payment_method || "",
source: order?.source || "",
items: order?.items || []
});

const [selectedProductId, setSelectedProductId] = useState("");

useEffect(() => {
setFormData({
status: order?.status || "processing",
payment_status: order?.payment_status || "pending",
payment_method: order?.payment_method || "card",
source: order?.source || "admin",
items: order?.items || []
});
}, [order]);

const handleAddItem = () => {
if (!selectedProductId) return;


const exists = formData.items.some(i => i.product_id === selectedProductId);
if (exists) return;

const newItem = {
  product_id: parseInt(selectedProductId),
  quantity: 1
};

setFormData(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));

setSelectedProductId("");


};

const handleChangeQuantity = (productId, qty) => {
const updated = formData.items.map(item =>
item.product_id === productId
? { ...item, quantity: qty }
: item
);

```
setFormData(prev => ({ ...prev, items: updated }));
```

};

const handleDelete = (productId) => {
setFormData(prev => ({
...prev,
items: prev.items.filter(item => item.product_id !== productId)
}));
};

const handleSubmit = (e) => {
e.preventDefault();
onSave(formData);
};

return ( <Form onSubmit={handleSubmit}>
{JSON.stringify(products)}
  {/* Datos base */}
  <Form.Group className="mb-3">
    <Form.Label>Estado *</Form.Label>
    <Form.Control
      type="text"
      required
      value={formData.status}
      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Estado Pago *</Form.Label>
    <Form.Control
      type="text"
      required
      value={formData.payment_status}
      onChange={(e) =>
        setFormData({ ...formData, payment_status: e.target.value })
      }
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Método Pago</Form.Label>
    <Form.Control
      type="text"
      value={formData.payment_method}
      onChange={(e) =>
        setFormData({ ...formData, payment_method: e.target.value })
      }
    />
  </Form.Group>


  {/* Agregar item */}
  <div className="d-flex align-items-center gap-2 mb-3">
    <Form.Select
      value={selectedProductId}
      onChange={(e) => setSelectedProductId(e.target.value)}
    >
      <option value="">Seleccionar producto...</option>

      {products?.map(p => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}

    </Form.Select>

    <Button onClick={handleAddItem}>
      Agregar
    </Button>
  </div>


  {/* Tabla de items */}
  <Table bordered striped>
    <thead>
      <tr>
        <th>Producto</th>
        <th style={{ width: 120 }}>Cantidad</th>
        <th style={{ width: 100 }}>Acción</th>
      </tr>
    </thead>

    <tbody>
      {formData.items.length === 0 && (
        <tr>
          <td colSpan={3} className="text-center text-muted">
            No hay productos agregados
          </td>
        </tr>
      )}

      {formData.items.map(item => {
        const p = products.find(x => x.id === item.product_id);

        return (
          <tr key={item.product_id}>
            <td>{p?.name || `Producto ${item.product_id}`}</td>

            <td>
              <Form.Control
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleChangeQuantity(item.product_id, parseInt(e.target.value))
                }
              />
            </td>

            <td>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(item.product_id)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>


  {/* Botones */}
  <div className="d-flex justify-content-end gap-2 mt-4">
    <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
      Cancelar
    </Button>

    <Button
      variant="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Guardando..." : "Guardar"}
    </Button>
  </div>

</Form>

);
}
