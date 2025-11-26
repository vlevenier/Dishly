import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createInvoice, updateInvoice } from "../../services/Invoices";
import { useModal } from "../../context/ModalContext";

export default function FormInvoice({ onSave, invoice }) {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      provider_id: "",
      amount: "",
      date: "",
      description: "",
      file: null
    }
  });

  // -------------------------------
  // Setear valores si estamos editando
  // -------------------------------
  useEffect(() => {
    if (invoice) {
      reset(invoice);
    }
  }, [invoice, reset]);

  // -------------------------------
  // Submit
  // -------------------------------
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          provider_id: data.provider_id,
          amount: data.amount,
          date: data.date,
          description: data.description
        })
      );

      // Solo agregar archivo si el usuario seleccionó uno nuevo
      if (data.file && data.file.length > 0) {
        fd.append("file", data.file[0]);
      }

      let saved;
      if (invoice?.id) {
        // UPDATE
        saved = await updateInvoice(invoice.id, fd);
      } else {
        // CREATE
        saved = await createInvoice(fd);
      }

      if (onSave) onSave(saved);
      reset();
      closeModal();
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert("Error al guardar la factura");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto bg-white rounded-xl shadow p-6 space-y-5"
    >
      <h2 className="text-xl font-semibold mb-2 border-b pb-2">
        {invoice ? "Editar Factura" : "Nueva Factura"}
      </h2>

      {/* Provider ID */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Proveedor ID *</label>
        <input
          type="number"
          {...register("provider_id", {
            required: "El proveedor es obligatorio",
            min: { value: 1, message: "Debe ser un ID válido" }
          })}
          className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none ${
            errors.provider_id ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.provider_id && (
          <p className="text-red-500 text-sm mt-1">{errors.provider_id.message}</p>
        )}
      </div>

      {/* Amount */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Monto *</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "El monto es obligatorio",
            min: { value: 0.01, message: "El monto debe ser mayor que 0" }
          })}
          className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none ${
            errors.amount ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Fecha *</label>
        <input
          type="date"
          {...register("date", { required: "La fecha es obligatoria" })}
          className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none ${
            errors.date ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Descripción</label>
        <input
          type="text"
          {...register("description")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
        />
      </div>

      {/* File */}
      <div className="mb-3">
        <label className="block font-medium mb-1">
          Archivo (PDF/JPG/PNG) {invoice ? "(Opcional)" : "*"}
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          {...register("file", {
            validate: (files) => {
              if (!files || files.length === 0) return true; // opcional en edición
              const allowed = ["application/pdf", "image/jpeg", "image/png"];
              return allowed.includes(files[0].type) || "Formato no permitido";
            }
          })}
        />
        {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
        {invoice?.file_key && !errors.file && (
          <p className="text-gray-500 text-sm mt-1">
            Archivo actual: {invoice.file_key}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-semibold transition ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Guardando..." : invoice ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}
