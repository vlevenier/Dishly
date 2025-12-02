import React, { useEffect, useState, useCallback } from "react";
import { createOrder, getOrdersFilter, updateOrderPayment } from "../services/Orders";
import { useModal } from "../context/ModalContext";
import FormOrder from "./forms/FormOrders";
import { getProducts } from "../services/Products";
import OrdersTable from "./datatables/OrdersTable";
import debounce from "lodash.debounce";
import FormPaymentUpdate from "./forms/FormPaymentUpdate";

export default function ADMOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const { showModal, closeModal } = useModal();

  const [filters, setFilters] = useState({
    status: undefined,
    source: undefined,
    sortField: "created_at",
    sortDir: "DESC",
    page: 1,
    limit: 20,
    todayOnly: true,
  });

  // 🔧 Cambio seguro de filtros sin sobrescribir todo el objeto
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 📌 Cargar productos solo 1 vez
  useEffect(() => {
    const loadProducts = async () => {
      const list = await getProducts();
      setProducts(list);
    };
    loadProducts();
  }, []);

  // 📌 Debounce para cargar órdenes
  const fetchOrders = useCallback(
    debounce(async (params) => {
      try {
        setLoading(true);
        const resp = await getOrdersFilter(params);
        setOrders(resp.data ?? []);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // 📌 Ejecutar fetch cuando cambien los filtros
  useEffect(() => {
    fetchOrders(filters);
    return () => fetchOrders.cancel();
  }, [filters, fetchOrders]);

  // 📌 Guardar orden
  const saveOrder = async (formData) => {
    try {
      if (!formData.items?.length) {
        alert("Debe agregar al menos un producto.");
        return;
      }

      const payload = {
        status: formData.status,
        payment_status: formData.payment_status,
        payment_method: formData.payment_method,
        source: formData.source,
        items: formData.items.map((i) => ({
          product_id: Number(i.product_id),
          quantity: Number(i.quantity),
        })),
      };

      const { data } = await createOrder(payload);

      // 🔄 Actualizar tabla sin recargar todo
      updateFilters({ page: 1 });

      closeModal();
    } catch (error) {
      console.error("Error al guardar orden:", error);
    }
  };

  const updatePayment = async (payload) => {

    console.log("Updating payment with data:", payload );  
    //return;
    const resp = await updateOrderPayment(
     payload
    );
    console.log("Payment update response:", resp );  
    // 🔄 Actualizar tabla sin recargar todo
    updateFilters({ page: 1 });
    closeModal();
  };


  // 📌 Abrir modal crear/editar
  const openCreateModal = (order) => {
    showModal(
      <FormOrder onSave={saveOrder} products={products} order={order} />
    );
  };

  return (
    <div>
      <h1>Administración de Pedidos</h1>

      <button onClick={openCreateModal}>Crear Pedido</button>

      {/* AQUÍ IRÁN LOS FILTROS DE STATUS / SOURCE / ORDER / SEARCH */}
<div style={{ marginBottom: 20 }}>
  <label style={{ marginRight: 10 }}>
    <input
      type="checkbox"
      checked={filters.todayOnly}
      onChange={(e) =>
        updateFilters({
          todayOnly: e.target.checked,
          page: 1,
        })
      }
    />
    &nbsp; Solo pedidos de hoy
  </label>
</div>

      <OrdersTable
        orders={orders}
        loading={loading}
        onEdit={(order) => openCreateModal(order)}
        onChangePayment={(order) => {
          showModal(
            <FormPaymentUpdate order={order} onSave={updatePayment}  />
          );
        }}
      />
    </div>
  );
}
