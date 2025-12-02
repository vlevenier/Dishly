import React, { useState } from "react";

export default function FormPaymentUpdate({ order, onSave }) {
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status || "");
  const [paymentMethod, setPaymentMethod] = useState(order.payment_method || "");

  const paymentStatuses = ["pending", "paid", "failed"];
  const paymentMethods = ["efectivo", "debito", "credito", "transferencia"];

  const submit = () => {
    onSave({
      id: order.id,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
    });
  };

  return (
    <div>
      <h3>Actualizar Pago</h3>

      <label>Estado Pago</label>
      <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
        <option value="">Seleccionar…</option>
        {paymentStatuses.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <label>Método Pago</label>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="">Seleccionar…</option>
        {paymentMethods.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <button onClick={submit}>Guardar</button>
    </div>
  );
}
