import React, { useEffect, useState } from "react";
import { getOrders } from "../services/Orders";
import { useModal } from "../context/ModalContext";
import { getProducts } from "../services/Products";
import FormInvoice from "./forms/FormInvoices";
import { getInvoices } from "../services/Invoices";
import InvoicesTable from "./datatables/InvoicesTable";
import { getFileURL } from "../services/Files";


export default function ADMInvoices() {
  const [invoices, setInvoices] = useState([]);
      const { showModal, closeModal } = useModal();
      const [loading, setLoading] = React.useState(false);
      const [products, setProducts] = React.useState([]);
      const loadOrders = async () => {
        try {
          setLoading(true);
          const list = await getInvoices();
          setInvoices(list);
        } finally {
          setLoading(false);
        }
      };

      const loadProducts = async () => {
        const list = await getProducts();
        setProducts(list);  
      };
    
       const openPDF = (fileKey) => {
    window.open(`http://tu-api.com/api/files/signed/${fileKey}`, "_blank");
  };
      useEffect(() => {
        loadOrders();
        loadProducts();
      }, []);


      const openFile = async (fileKey) => {
  try {
    const url = await getFileURL(fileKey);
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (err) {
    console.error("Error abriendo archivo:", err);
    alert("No se pudo abrir el archivo.");
  }
};

      const openCreateModal = ( invoice = null) => {
         //loading(false);
          showModal(<FormInvoice invoice={invoice} onSave={null}  />);
        };
    return (
    <div>
      <h1>Administración de Facturas</h1>
        <button onClick={openCreateModal}>Crear Pedido</button>


        <InvoicesTable invoices={invoices} onViewFile={openFile} onEdit={(invoice) => openCreateModal(invoice) } />
    </div>
  );
}