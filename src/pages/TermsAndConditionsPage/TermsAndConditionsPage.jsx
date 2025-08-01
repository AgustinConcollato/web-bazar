import { useEffect } from 'react';
import './TermsAndConditionsPage.css';

export function TermsAndConditionsPage() {

    useEffect(() => {
        document.title = 'Términos y Condiciones - Bazarshop'
        scrollTo(0, 0)
    }, [])

    return (
        <section className="terms-and-conditions-page">
            <h1>Términos y Condiciones</h1>

            <h3>Métodos y condiciones de Pago</h3>
            <p>Los métodos de pago disponibles son: transferencia bancaria, efectivo (contra reembolso) y cheque (contra reembolso).</p>
            <p>En caso de optar por el pago mediante cheque, el mismo deberá tener una fecha de vencimiento no mayor a 30 días desde su emisión.</p>
            {/* <p>En el caso de seleccionar dos métodos de pago, si uno de ellos es transferencia bancaria, el pedido no será despachado hasta que se acredite el importe correspondiente a dicha transferencia.</p> */}

            <h3>Modificación de Precios</h3>
            <p>Los precios de los productos pueden cambiar sin previo aviso, conforme a variaciones de mercado u otras circunstancias.</p>

            <h3>Imágenes</h3>
            <p>Las imágenes exhibidas en nuestro sitio web y materiales promocionales son meramente ilustrativas y tienen como fin brindar una mejor representación de los productos. Los productos reales pueden presentar variaciones en su apariencia.</p>

            <h3>Tiempos de Entrega</h3>
            <p>Los tiempos de entrega de los pedidos son estimativos y pueden variar dependiendo de la disponibilidad de los productos al momento de la compra. Nos comprometemos a informar cualquier demora que pueda surgir.</p>

            <h3>Costo de Envío</h3>
            <p>Envío a todo el país por transporte de preferencia. El costo del envío corre por cuenta del cliente.</p>

            <h3>Devoluciones</h3>
            <ul>
                <li>Requisitos sobre el Estado del Producto</li>
                <ul>
                    <li>
                        El producto debe tener sus embalajes originales (incluyendo interiores) y encontrarse en perfectas condiciones.
                    </li>
                    <li>
                        Debe estar completo, con todos sus accesorios, manuales y/o certificados correspondientes.
                    </li>
                    <li>
                        En caso de cambio por falla, el producto debe haberse utilizado correctamente. No se aceptarán cambios si se constata mal uso del producto.
                    </li>
                </ul>
                <li>Plazos</li>
                <ul>
                    <li>El plazo para realizar reclamos, es de 72 hs recibido el pedido.</li>
                </ul>
            </ul>

        </section>
    )
}