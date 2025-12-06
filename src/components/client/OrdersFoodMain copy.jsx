import "../../styles/ClientOrder.css";
// import { createOrder } from "../../services/Orders"; // Descomentar al usar el servicio real
import { useState } from "react";
import PaymentListener from "../socket/PaymentListener";
import { createOrder } from "../../services/Payment";
import PaymentListenerSC from "../socket/PaymentListenerSC";
export default function OrderClientViewMain({ menu }) {

    // -------------------------
    // Normalizar menú
    // -------------------------
    const categories = menu?.categories || [];
    const combos = menu?.combos || [];

    // Insertamos "Combos" como categoría virtual
    const fullMenu = [
        ...categories,
        {
            id: "combos-section",   // id único que no colisiona con categorías
            name: "Combos",
            products: combos
        }
    ];

    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(
        fullMenu?.[0]?.id || null
    );

    const [isLoading, setIsLoading] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);
    const [error, setError] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);


    // -------------------------
    // Productos de la categoría actual
    // -------------------------
    const productos =
        fullMenu.find((cat) => cat.id === selectedCategory)?.products || [];


    // -------------------------
    // Carrito
    // -------------------------
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

    const removeItem = (productId) => {
        setCart((prev) => prev.filter((i) => i.product_id !== productId));
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
                    if (newQuantity > 0) acc.push({ ...item, quantity: newQuantity });
                } else acc.push(item);
                return acc;
            }, [])
        );
    };


    // -------------------------
    // Totales
    // -------------------------
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = subtotal;


    // -------------------------
    // Flujo de pago
    // -------------------------
  //  const advanceStep = (stepNumber) => setProcessingStep(stepNumber);

    const finalizarPedido = () => {
        (async () => {

            if (isLoading || cart.length === 0) return;

            setIsLoading(true);
            setError(null);
            setProcessingStep(1); // Paso 1

            const stepDelay = 1000;

            try {
                // --- 1. CREAR ORDEN ---
                const payload = {
                    status: "pending",
                    payment_status: "pending",
                    payment_method: "kiosko_mp",
                    source: "kiosk",
                    items: cart.map((c) => ({
                        product_id: c.product_id,
                        quantity: c.quantity,
                    })),
                };

                const response = await createOrder(payload);

                const paymentData = response.payment_info;
                const orderId = response.order_id;

                setActiveOrderId(orderId);

                // --- PASO 2: OBTENIENDO CREDENCIALES DE PAGO ---
                await new Promise(r => setTimeout(r, stepDelay));
                setProcessingStep(2);

                // --- PASO 3: MOSTRAR PANTALLA DE PAGO ---
                await new Promise(r => setTimeout(r, stepDelay));
                setProcessingStep(3);

                // Mostrar interfaz
                handlePaymentDisplay(orderId, paymentData);

                // Limpieza
                setCart([]);
                setIsLoading(false);

                // Opcional: reiniciar modal después de mostrar pago
            // setTimeout(() => setProcessingStep(0), 300);

            } catch (error) {

                console.error("Error al finalizar el pedido:", error);

                setError(`Error al conectar: ${error.message || "El servidor no respondió."}`);
                setIsLoading(false);
                setProcessingStep(99);
            }

        })();
    };


const handlePaymentDisplay = () =>{

}
    // -------------------------
    // RENDER
    // -------------------------

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
        alert("erroAr");
        console.error(`Pago fallido para la orden ${orderId}. Razón: ${reason}`);
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de error al usuario.
        setProcessingStep(99);
        alert("error");
    }
    return (
        <>
            {/* Modal procesamiento */}
            {renderProcessingModal()}

            <PaymentListenerSC
                activeOrderId={activeOrderId}
                onPaymentSuccess={handleSuccess}
                onPaymentFailure={handleFailure}
            />

            <section className="pedido-modulo-contenedor">

                {/* CATEGORÍAS */}
                <aside className="pedido-navegacion">
                    <h2 className="navegacion-titulo">Menú del Foodtruck</h2>

                    <nav className="lista-categorias">
                        {fullMenu?.filter(e=> e.products.length > 0)?.map((cat) => (
                            <button
                                key={cat.id}
                                className={`categoria-item ${selectedCategory === cat.id ? "activo" : ""}`}
                                onClick={() => setSelectedCategory(cat.id)}
                                disabled={isLoading}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </nav>
                </aside>    


                {/* PRODUCTOS */}
                <main className="pedido-productos">

                    <h1 className="productos-titulo">
                        {fullMenu.find((c) => c.id === selectedCategory)?.name || ""}
                    </h1>

                    <div className="lista-productos-grid">
                        {productos?.map((producto) => (
                            <article key={producto?.id} className="producto-tarjeta">
                                <div className="producto-imagen-contenedor">
                                    <img
                                        src={`${producto?.image_url || "https://via.placeholder.com/400x225"}`}
                                        alt={producto?.name}
                                        className="producto-imagen"
                                    />
                                </div>

                                <div className="producto-info">
                                    <h3 className="producto-nombre">{producto?.name}</h3>

                                    <p className="producto-descripcion">
                                        {producto?.description || "Descripción del producto"}
                                    </p>

                                    <div className="producto-precio-accion">
                                        <span className="producto-precio">
                                            ${producto?.base_price.toLocaleString("es-CL")}
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
                            <p className="carrito-vacio-mensaje">Agrega productos para comenzar</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.product_id} className="carrito-item">
                                    <div className="item-info">
                                        <span className="item-nombre">{item.productName}</span>
                                        <span className="item-subtotal">
                                            ${(item.price * item.quantity).toLocaleString("es-CL")}
                                        </span>
                                    </div>

                                    <div className="item-controles">
                                        <button
                                            className="btn-ajustar-cantidad"
                                            onClick={() => decreaseQuantity(item.product_id)}
                                            disabled={isLoading}
                                        >
                                            -
                                        </button>

                                        <span className="item-cantidad-badge">{item.quantity}</span>

                                        <button
                                            className="btn-ajustar-cantidad"
                                            onClick={() => increaseQuantity(item.product_id)}
                                            disabled={isLoading}
                                        >
                                            +
                                        </button>

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
