import React, { useEffect } from 'react';
import io from 'socket.io-client';

// Define la URL de tu backend de Node.js donde Socket.IO está corriendo
// ¡Asegúrate de que este puerto sea el mismo que el de tu server.ts (ej. 3000)!
//const SOCKET_SERVER_URL = "http://localhost:3000"; 
const SOCKET_SERVER_URL = import.meta.env.VITE_BASE_URL; //+ ":3000"; // Ajusta el puerto si es necesario

/*
 * NOTA: La definición de "interface" fue eliminada para evitar el error de TypeScript (TS8006) 
 * ya que este es un archivo .jsx. La lógica de tipado fue convertida a JavaScript.
 *
 * El componente espera las siguientes props:
 * - activeOrderId: string | null
 * - onPaymentSuccess: function(orderId)
 * - onPaymentFailure: function(orderId, reason)
 */

const PaymentListener = ({ 
    activeOrderId, 
    onPaymentSuccess, 
    onPaymentFailure 
}) => {
    
    useEffect(() => {
        console.log(`[Socket] useEffect triggered for order: ${activeOrderId}`);
        // Solo intentamos conectarnos e iniciar la escucha si hay una orden activa
        if (!activeOrderId) {
            return;
        }

        console.log(`[Socket] Conectando y esperando orden: ${activeOrderId}`);
        
        // 1. Establecer la conexión con el servidor Socket.IO
        const socket = io(SOCKET_SERVER_URL);
        
        // 2. Escuchar el evento de actualización de pago desde el backend
        // Se asume la estructura de datos: { orderId: string, status: string, total: number }
        socket.on('payment_update', (data) => {
            console.log(`[Socket] Evento recibido:`, data);
            // 3. Filtrar: Solo actuar si el ID de la orden coincide con la que estamos esperando
            if (data.orderId === activeOrderId) {
                console.log(`[Socket] Evento recibido para la orden activa: ${data.orderId}`);
                
                if (data.status === 'paid') {
                    // Llamar al callback de éxito y cerrar la conexión
                    onPaymentSuccess(data.orderId);
                    
                } else if (data.status === 'rejected') {
                    // Llamar al callback de fallo y cerrar la conexión
                    onPaymentFailure(data.orderId, 'Pago rechazado por el banco o el sistema.');
                }
                
                // Desconectar el socket inmediatamente después de recibir la respuesta de la orden
                socket.disconnect();
            }
        });

        // 4. Función de limpieza: Se ejecuta al desmontar o antes de re-ejecutar el useEffect
        return () => {
            console.log(`[Socket] Desconectando listener para ${activeOrderId}`);
            socket.disconnect();
        };
    }, [activeOrderId, onPaymentSuccess, onPaymentFailure]);
    // El hook se re-ejecutará cuando cambie la orden activa,
    // reestableciendo la conexión para la nueva orden.

    return null; // Este componente es un 'listener' y no renderiza UI
};

export default PaymentListener;