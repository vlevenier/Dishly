import React, { useEffect, useState, useMemo } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { getProducts } from "../../services/Products";

export default function FormCombos({ combo, onSave, onCancel }) {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    base_price: 0,
    items: [],
  });

  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const list = await getProducts();
      setProducts(list);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!combo) return;

    setFormData({
      name: combo.name,
      base_price: combo.base_price,
      items: combo.items.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity
      }))
    });
  }, [combo]);

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const exists = formData.items.some((i) => i.product_id === parseInt(selectedProductId));
    if (exists) return;

    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { product_id: parseInt(selectedProductId), quantity: 1 }
      ],
    }));

    setSelectedProductId("");
  };

  const handleQuantityChange = (productId, qty) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.product_id === productId ? { ...i, quantity: qty } : i
      ),
    }));
  };

  const handleDelete = (productId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.product_id !== productId),
    }));
  };

  const itemsWithDetails = useMemo(() => {
    return formData.items.map((item) => {
      const p = products.find((x) => x.id === String(item.product_id));
      return {
        ...item,
        name: p?.name ?? "",
        price: p?.base_price ?? 0,
        subtotal: (p?.base_price ?? 0) * item.quantity,
      };
    });
  }, [formData.items, products]);

  const total = useMemo(
    () => itemsWithDetails.reduce((acc, x) => acc + x.subtotal, 0),
    [itemsWithDetails]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(
      {
        name: formData.name,
        base_price: formData.base_price,
        items: formData.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      },
      combo?.id
    );
  };

  return (
    <Form onSubmit={handleSubmit}>

      <Form.Group className="mb-3">
        <Form.Label>Nombre del Combo *</Form.Label>
        <Form.Control
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Precio Base *</Form.Label>
        <Form.Control
          type="number"
          value={formData.base_price}
          onChange={(e) =>
            setFormData({ ...formData, base_price: Number(e.target.value) })
          }
        />
      </Form.Group>

      <div className="d-flex align-items-center gap-2 mb-3">
        <Form.Select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Seleccionar producto...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Form.Select>

        <Button onClick={handleAddItem}>Agregar</Button>
      </div>

      <Table bordered striped>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
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

          {itemsWithDetails.map((i) => (
            <tr key={i.product_id}>
              <td>{i.name}</td>
              <td>${i.price}</td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={i.quantity}
                  onChange={(e) =>
                    handleQuantityChange(i.product_id, Number(e.target.value))
                  }
                />
              </td>
              <td>${i.subtotal}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(i.product_id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="text-end mt-3">
        Total: <strong>${total}</strong>
      </h4>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>

        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </div>
    </Form>
  );
}
