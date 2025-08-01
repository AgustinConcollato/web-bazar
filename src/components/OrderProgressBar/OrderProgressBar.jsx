import React from "react";
import './OrderProgressBar.css'

export function OrderProgressBar({ totalAmount }) {
    const minPurchase = 100000;
    const discountThreshold = 300000;
    const discountRate = 0.05;
    const progress = Math.min((totalAmount / discountThreshold) * 100, 100);

    let message = "";
    let savings = 0;
    if (totalAmount < minPurchase) {
        message = `Te faltan $${(minPurchase - totalAmount).toLocaleString('es-AR', { maximumFractionDigits: 2 })} para la compra mínima.`;
    } else if (totalAmount < discountThreshold) {
        message = `Te faltan $${(discountThreshold - totalAmount).toLocaleString('es-AR', { maximumFractionDigits: 2 })} para obtener un 5% de descuento.`;
    } else {
        savings = totalAmount * discountRate;
        message = `Obtienes un 5% de descuento y ahorrás $${savings.toLocaleString('es-AR', { maximumFractionDigits: 2 })}.`;
    }

    return (
        <div className="order-progress-bar-wrapper">
            <div className="progress-line-container">
                <div className="progress-line" />
                {/* Puntos principales */}
                <div className="progress-point start-point" style={{ left: '-8px' }}>
                    <span className="progress-label" style={{ left: '5px' }}>$0</span>
                </div>
                <div className={`progress-point min-point${totalAmount >= minPurchase ? ' active' : ''}`} style={{ left: 'calc(33% - 8px)' }} >
                    <span className="progress-label-message">Mínimo de compra </span>
                    <span className="progress-label" style={{ left: '50%' }}>$100.000</span>
                </div>
                <div className={`progress-point discount-point${totalAmount >= discountThreshold ? ' active' : ''}`} style={{ left: 'calc(100% - 9px)' }} >
                    <span className="progress-label-message">Obtener descuento</span>
                    <span className="progress-label" style={{ left: 'calc(100% - 25px)' }}>$300.000</span>
                </div>
                {/* Punto móvil/intermedio */}
                <div className="progress-current-point" style={{ left: `${progress}%` }} >
                    <span className="progress-label-message">Monto actual</span>
                </div>
            </div>
            <div className="progress-amount">
                ${parseFloat(totalAmount).toLocaleString('es-AR', { maximumFractionDigits: 2 })} / $300.000
            </div>
            <div className="progress-message">{message}</div>
        </div>
    );
}