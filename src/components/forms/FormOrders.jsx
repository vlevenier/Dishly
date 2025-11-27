import React, { useEffect, useState, useMemo } from "react";
import { Button, Form, Table } from "react-bootstrap";

export default function FormOrder({
  order,
  products,
  onSave,
  onCancel,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    status: "processing",
    payment_status: "pending",
    payment_method: "card",
    source: "admin",
    items: [],
  });

  const [selectedProductId, setSelectedProductId] = useState("");

  // Cargar datos en caso de edición
  useEffect(() => {
    if (!order) return;

    setFormData({
      status: order.status || "processing",
      payment_status: order.payment_status || "pending",
      payment_method: order.payment_method || "card",
      source: order.source || "admin",
      items: order.items || [],
    });
  }, [order]);

  //
  // Agregar item
  //
  const handleAddItem = () => {
    if (!selectedProductId) return;

    const exists = formData.items.some(
      (i) => i.product_id === parseInt(selectedProductId)
    );
    if (exists) return;

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: parseInt(selectedProductId),
          quantity: 1,
        },
      ],
    }));

    setSelectedProductId("");
  };

  //
  // Cambiar cantidad
  //
  const handleChangeQuantity = (productId, qty) => {
    if (qty < 1) qty = 1;

    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product_id === productId ? { ...item, quantity: qty } : item
      ),
    }));
  };

  //
  // Eliminar item
  //
  const handleDelete = (productId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.product_id !== productId),
    }));
  };

  //
  // Cálculo de precios y totales
  //
  const itemsWithDetails = useMemo(() => {
    return formData.items.map((item) => {
      const product = products.find((p) => p.id === String(item.product_id));
      const price = product ? parseFloat(product.base_price) : 0;

      return {
        ...item,
        price,
        subtotal: price * item.quantity,
        productName: product?.name || `Producto ${item.product_id}`,
      };
    });
  }, [formData.items, products]);

  const total = useMemo(
    () => itemsWithDetails.reduce((acc, item) => acc + item.subtotal, 0),
    [itemsWithDetails]
  );

  //
  // Guardar
  //
  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...formData,
      items: formData.items, // la API sigue igual
    });
  };

  return (
    <Form onSubmit={handleSubmit}>

      {/* Datos base */}
      <Form.Group className="mb-3">
        <Form.Label>Estado *</Form.Label>
        <Form.Control
          type="text"
          required
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
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

          {products?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Form.Select>

        <Button onClick={handleAddItem}>Agregar</Button>
      </div>

      {/* Tabla */}
      <Table bordered striped>
        <thead>
          <tr>
            <th>Producto</th>
            <th style={{ width: 120 }}>Precio</th>
            <th style={{ width: 120 }}>Cantidad</th>
            <th style={{ width: 120 }}>Subtotal</th>
            <th style={{ width: 100 }}>Acción</th>
          </tr>
        </thead>

        <tbody>
          {itemsWithDetails.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted">
                No hay productos agregados
              </td>
            </tr>
          )}

          {itemsWithDetails.map((item) => (
            <tr key={item.product_id}>
              <td>{item.productName}</td>
              <td>${item.price}</td>

              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChangeQuantity(
                      item.product_id,
                      parseInt(e.target.value)
                    )
                  }
                />
              </td>

              <td>${item.subtotal}</td>

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
          ))}
        </tbody>
      </Table>

      {/* Total */}
      <h4 className="text-end mt-3">
        Total: <strong>${total}</strong>
      </h4>

      {/* Botones */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </Form>
  );
}
