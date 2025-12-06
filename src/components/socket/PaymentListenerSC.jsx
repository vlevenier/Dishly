import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_BASE_URL;

const PaymentListenerSC = ({ 
    activeOrderId, 
    onPaymentSuccess, 
    onPaymentFailure 
}) => {

    const socketRef = useRef(null);

    useEffect(() => {
        console.log(`[Socket] Listener activado para orderId: ${activeOrderId}`);

        if (!activeOrderId) return;

        // 1. Crear la conexión
        socketRef.current = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 500
        });

        console.log("[Socket] Conectado a servidor:", SOCKET_SERVER_URL);

        // --- FUNCIÓN COMÚN PARA MANEJAR RESPUESTAS ---
        const handleSocketEvent = (data) => {
            console.log("[Socket] Datos recibidos:", data);
            
            // Validación básica
            if (!data?.orderId) return;

            // Filtramos: Solo actuamos si el mensaje es para ESTA orden
            if (String(data.orderId) === String(activeOrderId)) {

                console.log("[Socket] Match confirmado para orden:", activeOrderId);

                if (data.status === "paid") {
                    // Éxito (Viene por payment_update)
                    onPaymentSuccess(data.orderId);
                } else {
                    // Error/Cancelado (Viene por payment_info)
                    onPaymentFailure(data.orderId, "Pago no procesado o cancelado");
                }

                // Cerramos conexión al terminar
                socketRef.current.disconnect();
            } 
            // NOTA: Si los ID no coinciden, ignoramos el mensaje silenciosamente.
            // No disparamos onPaymentFailure aquí para no cancelar la orden de otro cliente.
        };

        // 2. Escuchar AMBOS canales con la misma lógica
        // Canal de éxito (Impresora escucha este)
        socketRef.current.on("payment_update", handleSocketEvent);
        
        // Canal de error/info (Impresora ignora este)
        socketRef.current.on("payment_info", handleSocketEvent);


        // 3. Limpieza al desmontar
        return () => {
            if (socketRef.current) {
                console.log(`[Socket] Desconectando listener de orden: ${activeOrderId}`);
                socketRef.current.disconnect();
            }
        };

    }, [activeOrderId]);

    return null;
};

export default PaymentListenerSC;