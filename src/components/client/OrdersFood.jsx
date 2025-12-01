import { createOrder } from "../../services/Orders";
import "../../styles/ClientOrder.css";
// import { createOrder } from "../../services/Orders"; // Descomentar al usar el servicio real
import { useState } from "react";
import PaymentListener from "../socket/PaymentListener";

export default function OrderClientView({ menu }) {
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(
        menu?.[0]?.id || null
    );
    const [isLoading, setIsLoading] = useState(false);
    // Controla qué paso del modal está activo (0: Inactivo, 1-3: Pasos, 99: Error)
    const [processingStep, setProcessingStep] = useState(0); 
    // Almacena el mensaje de error si ocurre un fallo
    const [error, setError] = useState(null); 
    const [activeOrderId, setActiveOrderId] = useState(null);
    // Obtener productos por categoría seleccionada
    const productos =
        menu.find((cat) => cat.id === selectedCategory)?.products || [];

    // Agregar al carrito
    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((i) => i.product_id === product.id);

            if (exists) {
                return prev.map((i) =>
                    i.product_id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [
                ...prev,
                {
                    product_id: product.id,
                    quantity: 1,
                    price: product.base_price,
                    productName: product.name,
                },
            ];
        });
    };

    // Remover del carrito (elimina el ítem completo)
    const removeItem = (productId) => {
        setCart((prev) => prev.filter((i) => i.product_id !== productId));
    };

    // Totales
    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = subtotal;

    // Función para avanzar el paso en el modal
    const advanceStep = (stepNumber) => {
        setProcessingStep(stepNumber);
    };


    //
    // Confirmar pedido (con Simulación de Flujo y Error)
    //
const finalizarPedido = () => {
    // Definimos la función como async y la llamamos inmediatamente (IIFE)
    (async () => {
        if (isLoading || cart.length === 0) return;

        setIsLoading(true);
        setError(null);
        setProcessingStep(1); // 1. Inicia el paso: Creando Orden

        const stepDelay = 1000; // 1 segundo para las transiciones visuales (UX)

        try {
            // Paso 1: CREAR ORDEN Y OBTENER INFO DE PAGO (Tiempo real de la API)

            const payload = {
                status: "pending", // La orden inicia en estado de espera
                payment_status: "pending",
                payment_method: "kiosko_mp", // Mejor descriptor para Kiosco/POS
                source: "kiosk",
                items: cart.map((c) => ({
                    product_id: c.product_id,
                    quantity: c.quantity,
                })),
            };

            const response = await createOrder(payload);
            
            // ⚡️ ADAPTACIÓN A KIOSCO: Obtenemos los datos necesarios para el pago local.
            const paymentData = response.payment_info; 
            console.log("Orden creada con éxito:", response);
            const orderId = response.data.order_id; // Necesitas el ID para el seguimiento
            setActiveOrderId(orderId); // Establece la orden activa para el listener de pagos
          /*  if (!paymentData || !orderId) {
                 throw new Error("Respuesta incompleta: Faltan datos de pago/orden.");
            }*/
            
            // --- ÉXITO EN LA CREACIÓN ---
            
            // Pausa visual para que el usuario vea que el Paso 1 se completó
            await new Promise(resolve => setTimeout(resolve, stepDelay));
            advanceStep(2); // 2. Pasa al paso: Obteniendo credenciales de pago

            // Pausa visual (UX)
            await new Promise(resolve => setTimeout(resolve, stepDelay));
            advanceStep(3); // 3. Pasa al paso: Mostrando pantalla de pago

            // ⚡️ ACCIÓN FINAL: Iniciar la interfaz de pago en el Kiosco
            console.log("Paso 3: Iniciando interfaz de pago en Kiosco con data:", paymentData);
            
            // Llama a tu función para renderizar el QR o activar el lector de tarjeta
            handlePaymentDisplay(orderId, paymentData); 
            
            // Limpieza: Cerramos el modal y vaciamos el carrito
            setCart([]);
            setIsLoading(false);
            setProcessingStep(0); 

        } catch (error) {
            // --- MANEJO DE ERRORES ---
            console.error("Error al finalizar el pedido:", error);
            
            setError(`Error al conectar: ${error.message || "El servidor no respondió."}`);
            
            // Finalizar carga y mostrar el modal de error (Paso 99)
            setIsLoading(false);
            setProcessingStep(99); 
        }
    })();
};

const increaseQuantity = (productId) => {
    setCart((prev) =>
        prev.map((item) =>
            item.product_id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
    );
};



const decreaseQuantity = (productId) => {
    setCart((prev) =>
        prev.reduce((acc, item) => {
            if (item.product_id === productId) {
                const newQuantity = item.quantity - 1;
                // Si la nueva cantidad es > 0, lo agregamos de vuelta al carrito.
                if (newQuantity > 0) {
                    acc.push({ ...item, quantity: newQuantity });
                }
                // Si es 0, simplemente no lo agregamos (se elimina).
            } else {
                acc.push(item);
            }
            return acc;
        }, [])
    );
};
    //
    // Renderizado del Modal de Procesamiento
    //
    const renderProcessingModal = () => {
        if (processingStep === 0) return null;

        const isErrorState = processingStep === 99;

        return (
            <div className="processing-modal-overlay">
            <div className="processing-modal">
                
                {/* TÍTULO DINÁMICO */}
                <h2 className="modal-titulo" style={{ color: isErrorState ? '#D32F2F' : '#ff5722' }}>
                    {isErrorState ? '🔴 Error en el Proceso' : 'Procesando tu Pedido'}
                </h2>
                <p className="modal-subtitulo">
                    {isErrorState 
                        ? 'Ocurrió un problema inesperado. Por favor, revisa y vuelve a intentarlo.' 
                        : 'Estamos asegurando tu orden antes de pasar al pago.'}
                </p>

                {/* VISUALIZACIÓN DE PROCESOS/ERROR */}
                <div className="procesos-lista">
                    
                    {isErrorState ? (
                        // MOSTRAR MENSAJE DE ERROR
                        <div className="error-box">
                            <p className="error-mensaje">{error || "Error de conexión desconocido."}</p>
                            <p className="error-instruccion">
                                Puedes revisar el carrito o intentar nuevamente.
                            </p>
                        </div>
                    ) : (
                        // MOSTRAR PASOS NORMALES (FLUJO KIOSCO)
                        <>
                            <div className={`proceso-item ${processingStep >= 1 ? 'activo' : ''} ${processingStep > 1 ? 'completado' : ''}`}>
                                <span className="proceso-icono">{processingStep > 1 ? '✅' : '⏳'}</span>
                                <span className="proceso-texto">1. Creando Orden en el Sistema...</span>
                            </div>

                            <div className={`proceso-item ${processingStep >= 2 ? 'activo' : ''} ${processingStep > 2 ? 'completado' : ''}`}>
                                <span className="proceso-icono">{processingStep > 2 ? '✅' : '🔒'}</span>
                                <span className="proceso-texto">2. Obteniendo Credenciales de Pago...</span>
                            </div>
                            
                            <div className={`proceso-item ${processingStep >= 3 ? 'activo' : ''}`}>
                                <span className="proceso-icono">💳</span> {/* Icono de pago/terminal */}
                                <span className="proceso-texto">3. Mostrando Pantalla de Pago...</span>
                            </div>
                        </>
                    )}
                </div>
                
                {/* BOTONES DE ACCIÓN (Solo se muestran en estado de error) */}
                {isErrorState && (
                    <div className="modal-acciones">
                        <button 
                            className="btn-modal-cancelar" 
                            onClick={() => setProcessingStep(0)} // Cierra el modal de error
                        >
                            Revisar Carrito
                        </button>
                        <button 
                            className="btn-modal-reintentar" 
                            onClick={finalizarPedido} // Vuelve a intentar la función
                        >
                            Volver a Intentar
                        </button>
                    </div>
                )}

                <p className="modal-nota">
                    {isErrorState ? "Si el problema persiste, contacta al personal." : "Por favor, no cierres ni recargues la ventana."}
                </p>
            </div>
        </div>
        );
    };

    
    const handleSuccess = (orderId) => {
        console.log(`Pago exitoso para la orden ${orderId}.`);
        // Aquí puedes agregar lógica adicional, como redirigir al usuario o mostrar un mensaje de éxito.
    }
    const handleFailure = (orderId, reason) => {
        console.error(`Pago fallido para la orden ${orderId}. Razón: ${reason}`);
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de error al usuario.
    }
    return (
        <>
            {/* Modal de Procesamiento */}
            {renderProcessingModal()} 
             <PaymentListener
             activeOrderId={activeOrderId} 
            onPaymentSuccess={handleSuccess} 
            onPaymentFailure={handleFailure}
        />
            <section className="pedido-modulo-contenedor">
                
                {/* CATEGORÍAS */}
                <aside className="pedido-navegacion">
                    <h2 className="navegacion-titulo">Menú del Foodtruck</h2>

                    <nav className="lista-categorias">
                        {menu.map((cat) => (
                            <button
                                key={cat.id}
                                className={`categoria-item ${
                                    selectedCategory === cat.id ? "activo" : ""
                                }`}
                                onClick={() => setSelectedCategory(cat.id)}
                                disabled={isLoading} // Deshabilitar navegación durante la carga/proceso
                            >
                                {cat.name}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* PRODUCTOS */}
                <main className="pedido-productos">
                    <h1 className="productos-titulo">
                        {menu.find((c) => c.id === selectedCategory)?.name || ""}
                    </h1>

                    <div className="lista-productos-grid">
                        {productos.map((producto) => (
                            <article key={producto.id} className="producto-tarjeta">
                                <div className="producto-imagen-contenedor">
                                    <img
                                        src={
                                            producto.image_url ||
                                            `https://via.placeholder.com/400x225/ff5722/ffffff?text=${encodeURIComponent(
                                                producto.name
                                            )}`
                                        }
                                        alt={producto.name}
                                        className="producto-imagen"
                                    />
                                </div>

                                <div className="producto-info">
                                    <h3 className="producto-nombre">{producto.name}</h3>
                                    <p className="producto-descripcion">
                                        {producto.description || "Descripción del producto"}
                                    </p>

                                    <div className="producto-precio-accion">
                                        <span className="producto-precio">
                                            ${producto.base_price.toLocaleString("es-CL")}
                                        </span>

                                        <button
                                            className="btn-agregar-carrito"
                                            onClick={() => addToCart(producto)}
                                            disabled={isLoading}
                                        >
                                            Añadir 🛒
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </main>

                {/* CARRITO */}
                <aside className="pedido-carrito">
                    <h2 className="carrito-titulo">
                        Tu Pedido <span>({totalItems} ítems)</span>
                    </h2>

                <div className="carrito-items-lista">
    {cart.length === 0 ? (
        <p className="carrito-vacio-mensaje">
            Agrega productos para comenzar
        </p>
    ) : (
        cart.map((item) => (
            <div key={item.product_id} className="carrito-item">
                
                {/* 1. INFORMACIÓN DEL PRODUCTO */}
                <div className="item-info">
                    <span className="item-nombre">{item.productName}</span>
                    <span className="item-subtotal">
                        ${(item.price * item.quantity).toLocaleString("es-CL")}
                    </span>
                </div>
                
                {/* 2. CONTROLES DE CANTIDAD Y ELIMINAR */}
                <div className="item-controles">
                    
                    {/* Botón de Disminuir (-) */}
                    <button 
                        className="btn-ajustar-cantidad" 
                        onClick={() => decreaseQuantity(item.product_id)} 
                        disabled={isLoading}
                    >
                        -
                    </button>
                    
                    {/* Visualización de Cantidad */}
                    <span className="item-cantidad-badge">{item.quantity}</span>
                    
                    {/* Botón de Aumentar (+) */}
                    <button 
                        className="btn-ajustar-cantidad" 
                        onClick={() => increaseQuantity(item.product_id)} 
                        disabled={isLoading}
                    >
                        +
                    </button>

                    {/* Botón de Eliminar Ítem Completo (Manteniendo la funcionalidad original de ❌) */}
                    <button
                        className="btn-eliminar-completo"
                        onClick={() => removeItem(item.product_id)}
                        disabled={isLoading}
                    >
                        ❌
                    </button>
                </div>
            </div>
        ))
    )}
</div>
                    <div className="carrito-resumen">
                        <div className="resumen-detalle">
                            <span>Subtotal:</span>
                            <span>${subtotal.toLocaleString("es-CL")}</span>
                        </div>

                        <div className="resumen-detalle resumen-total">
                            <span>Total:</span>
                            <span>${total.toLocaleString("es-CL")}</span>
                        </div>
                    </div>

                    <button
                        className="btn-finalizar-pago"
                        disabled={cart.length === 0 || isLoading}
                        onClick={finalizarPedido}
                    >
                        {isLoading ? "⏳ Procesando pedido..." : "Proceder al Pago"}
                    </button>
                </aside>
            </section>
        </>
    );
}