import "../../styles/ClientOrder.css";
import { useState, useEffect, useRef } from "react";
import { createOrder } from "../../services/Payment";
import PaymentListenerSC from "../socket/PaymentListenerSC";

export default function OrderClientViewMain({ menu }) {

    // -------------------------
    // 1. CONFIGURACIÓN
    // -------------------------
    const PAYMENT_TIMEOUT_MS = 12000; // 2 minutos (Watchdog)
    const SUCCESS_DISPLAY_TIME = 7;    // 5 segundos para ver el éxito
    const STEP_DELAY = 1000;           // Transiciones suaves

    // -------------------------
    // 2. NORMALIZACIÓN DE DATOS
    // -------------------------
    const categories = menu?.categories || [];
    const combos = menu?.combos || [];
    const fullMenu = [
        ...categories,
        { id: "combos-section", name: "Combos", products: combos }
    ];

    // -------------------------
    // 3. ESTADOS
    // -------------------------
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(fullMenu?.[0]?.id || null);
    
    // Estados de la Máquina de Pago
    const [isLoading, setIsLoading] = useState(false);
    // 0:Inactivo | 1:Creando | 2:Conectando | 3:Esperando Tarjeta | 4:ÉXITO | 99:Error
    const [processingStep, setProcessingStep] = useState(0); 
    const [error, setError] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);
    
    // Estado visual para la cuenta regresiva
    const [countdown, setCountdown] = useState(SUCCESS_DISPLAY_TIME);

    // Refs para temporizadores
    const watchdogTimerRef = useRef(null);

    // -------------------------
    // 4. LÓGICA DEL CARRITO
    // -------------------------
    const productos = fullMenu.find((cat) => cat.id === selectedCategory)?.products || [];

    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((i) => i.product_id === product.id);
            return exists 
                ? prev.map((i) => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev, { product_id: product.id, quantity: 1, price: product.base_price, productName: product.name }];
        });
    };

    const removeItem = (id) => setCart((prev) => prev.filter((i) => i.product_id !== id));
    
    const increaseQuantity = (id) => {
        setCart((prev) => prev.map((item) => item.product_id === id ? { ...item, quantity: item.quantity + 1 } : item));
    };

    const decreaseQuantity = (id) => {
        setCart((prev) => prev.reduce((acc, item) => {
            if (item.product_id === id) {
                if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 });
            } else acc.push(item);
            return acc;
        }, []));
    };

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = subtotal;

    // -------------------------
    // 5. EFECTOS (Lógica de Tiempo)
    // -------------------------

    // A) Watchdog (Seguridad en Paso 3)
    useEffect(() => {
        if (processingStep === 3) {
            watchdogTimerRef.current = setTimeout(() => {
                handleFailure(activeOrderId, "Se agotó el tiempo de espera en la terminal.");
            }, PAYMENT_TIMEOUT_MS);
        }
        return () => clearTimeout(watchdogTimerRef.current);
    }, [processingStep, activeOrderId]);

    // B) Contador de Éxito (Paso 4 -> Reset) [OPTIMIZADO]
    useEffect(() => {
        let interval = null;

        if (processingStep === 4) {
            // Reiniciamos el contador visualmente al entrar
            setCountdown(SUCCESS_DISPLAY_TIME);
            
            interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        // Cuando llega a 1, el siguiente tick es el fin
                        clearInterval(interval);
                        resetSystem(); // <--- Aquí se limpia todo y se cierra el modal
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [processingStep]);

    // -------------------------
    // 6. FUNCIONES DEL SISTEMA
    // -------------------------
    
    const resetSystem = () => {
        console.log("🔄 Sistema reiniciado para nuevo cliente");
        setCart([]);           
        setActiveOrderId(null); 
        setProcessingStep(0);   
        setIsLoading(false);    
        setError(null);
    };

    const finalizarPedido = async () => {
        if (isLoading || cart.length === 0) return;

        setIsLoading(true);
        setError(null);
        setProcessingStep(1); 

        try {
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

            if (!response || !response.order_id) throw new Error("Error en servidor");

            const orderId = response.order_id;
            setActiveOrderId(orderId); 

            // UX Transiciones
            await new Promise(r => setTimeout(r, STEP_DELAY));
            setProcessingStep(2); 

            await new Promise(r => setTimeout(r, STEP_DELAY));
            setProcessingStep(3); // Activa Watchdog y Listener

        } catch (error) {
            console.error(error);
            handleFailure(null, error.message || "Error de conexión.");
        }
    };

    // -------------------------
    // 7. HANDLERS
    // -------------------------
    const handleSuccess = (orderId) => {
        console.log(`✅ Pago exitoso Orden #${orderId}`);
        // No borramos carrito, vamos al paso 4 para mostrar el número gigante
        setProcessingStep(4);
    };

    const handleFailure = (orderId, reason) => {
        console.error(`❌ Fallo: ${reason}`);
        setError(reason || "El pago no pudo ser procesado.");
        setProcessingStep(99); 
        setIsLoading(false);
    };

    const cerrarModalError = () => {
        setProcessingStep(0);
        setError(null);
    };

    // -------------------------
    // 8. RENDERIZADO
    // -------------------------
    const renderProcessingModal = () => {
        if (processingStep === 0) return null;
        
        const isError = processingStep === 99;
        const isSuccess = processingStep === 4;

        return (
            <div className="processing-modal-overlay">
                <div className={`processing-modal ${isError ? 'modal-error' : ''} ${isSuccess ? 'modal-success' : ''}`}>
                    
                    {/* --- ESCENA DE ÉXITO --- */}
                    {isSuccess ? (
                        <div className="success-content animate-fade-in">
                            <div className="icon-success-wrapper">✅</div>
                            <h2 className="titulo-exito">¡Pedido Confirmado!</h2>
                            <p className="subtitulo-exito">Tu número de orden es:</p>
                            
                            <div className="numero-orden-gigante">
                                #{activeOrderId || "..."}
                            </div>
                            
                            <p className="instruccion-final">Por favor, retira tu ticket.</p>

                            <div className="barra-progreso-reset">
                                <div 
                                    className="barra-relleno" 
                                    style={{ width: `${(countdown / SUCCESS_DISPLAY_TIME) * 100}%` }}
                                ></div>
                            </div>
                            <p className="texto-reset">Reiniciando en {countdown}s...</p>
                        </div>
                    ) : (
                        /* --- ESCENAS DE PROCESO Y ERROR --- */
                        <>
                            <h2 className="modal-titulo" style={{ color: isError ? '#D32F2F' : '#ff5722' }}>
                                {isError ? '🔴 Error en el Pago' : 'Procesando tu Pedido'}
                            </h2>
                            
                            <p className="modal-subtitulo">
                                {isError ? 'Hubo un problema con la transacción.' : 'Sigue las instrucciones en pantalla.'}
                            </p>

                            <div className="procesos-lista">
                                {isError ? (
                                    <div className="error-box">
                                        <p className="error-mensaje">{error}</p>
                                        <div className="modal-acciones">
                                            <button className="btn-modal-cancelar" onClick={cerrarModalError}>Volver</button>
                                            <button className="btn-modal-reintentar" onClick={finalizarPedido}>Reintentar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`proceso-item ${processingStep >= 1 ? 'activo' : ''} ${processingStep > 1 ? 'completado' : ''}`}>
                                            <span className="proceso-icono">{processingStep > 1 ? '✅' : '⚙️'}</span>
                                            <span className="proceso-texto">1. Creando Orden...</span>
                                        </div>
                                        <div className={`proceso-item ${processingStep >= 2 ? 'activo' : ''} ${processingStep > 2 ? 'completado' : ''}`}>
                                            <span className="proceso-icono">{processingStep > 2 ? '✅' : '🔗'}</span>
                                            <span className="proceso-texto">2. Conectando Terminal...</span>
                                        </div>
                                        <div className={`proceso-item ${processingStep >= 3 ? 'activo' : ''}`}>
                                            <span className="proceso-icono">💳</span>
                                            <span className="proceso-texto" style={{fontWeight: 'bold'}}>3. Acerque su tarjeta al Point</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {renderProcessingModal()}

            <PaymentListenerSC 
                activeOrderId={activeOrderId}
                onPaymentSuccess={handleSuccess}
                onPaymentFailure={handleFailure}
            />

            <section className="pedido-modulo-contenedor">
                <aside className="pedido-navegacion">
                    <h2 className="navegacion-titulo">Menú</h2>
                    <nav className="lista-categorias">
                        {fullMenu?.filter(e => e.products.length > 0)?.map((cat) => (
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
                                    <p className="producto-descripcion">{producto?.description}</p>
                                    <div className="producto-precio-accion">
                                        <span className="producto-precio">${producto?.base_price.toLocaleString("es-CL")}</span>
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

                <aside className="pedido-carrito">
                    <h2 className="carrito-titulo">Tu Pedido <span>({totalItems})</span></h2>
                    <div className="carrito-items-lista">
                        {cart.length === 0 ? (
                            <p className="carrito-vacio-mensaje">Agrega productos para comenzar</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.product_id} className="carrito-item">
                                    <div className="item-info">
                                        <span className="item-nombre">{item.productName}</span>
                                        <span className="item-subtotal">${(item.price * item.quantity).toLocaleString("es-CL")}</span>
                                    </div>
                                    <div className="item-controles">
                                        <button className="btn-ajustar-cantidad" onClick={() => decreaseQuantity(item.product_id)} disabled={isLoading}>-</button>
                                        <span className="item-cantidad-badge">{item.quantity}</span>
                                        <button className="btn-ajustar-cantidad" onClick={() => increaseQuantity(item.product_id)} disabled={isLoading}>+</button>
                                        <button className="btn-eliminar-completo" onClick={() => removeItem(item.product_id)} disabled={isLoading}>❌</button>
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
                        {isLoading ? "⏳ Procesando..." : "Proceder al Pago"}
                    </button>
                </aside>
            </section>
        </>
    );
}