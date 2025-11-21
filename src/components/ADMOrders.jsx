import React, { useEffect } from "react";
import { getOrders } from "../services/Orders";
import { useModal } from "../context/ModalContext";
import FormOrder from "./forms/FormOrders";
import { getProducts } from "../services/Products";


export default function ADMOrders() {
      const [orders, setOrders] = React.useState([]);
      const { showModal, closeModal } = useModal();
      const [loading, setLoading] = React.useState(false);
      const [products, setProducts] = React.useState([]);
      const loadOrders = async () => {
        try {
          setLoading(true);
          const list = await getOrders();
          setOrders(list);
        } finally {
          setLoading(false);
        }
      };

      const loadProducts = async () => {
        const list = await getProducts();
        setProducts(list);  
      };
    
      useEffect(() => {
        loadOrders();
        loadProducts();
      }, []);



      const openCreateModal = () => {
         //loading(false);
          showModal(<FormOrder onSave={null} products={products} />);
        };
    return (
    <div>
      <h1>Administración de Pedidos</h1>
        <button onClick={openCreateModal}>Crear Pedido</button>
    </div>
  );
}