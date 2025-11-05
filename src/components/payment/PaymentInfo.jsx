import React from "react";
import { formatCurrency } from "../../utils/formatUtils";
import { formatDate } from "../../utils/dateUtils";
import Card from "../common/Card";
import Button from "../common/button";

const PaymentInfo = ({ paymentData }) => {
  if (!paymentData) return null;

  return (
    <Card className="payment-info-box" data-testid="payment-info">
      <div className="payment-info-header">
        <div className="payment-info-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2>Detalles del Pago</h2>
        <p>Por favor, revisa los detalles antes de proceder</p>
      </div>

      <div className="payment-info-details">
        <div className="payment-info-row">
          <span>Cliente:</span>
          <span>{paymentData.contact_name}</span>
        </div>

        {paymentData.appointment_type && (
          <div className="payment-info-row">
            <span>Tipo de Cita:</span>
            <span>{paymentData.appointment_type}</span>
          </div>
        )}

        {paymentData.appointment_date && (
          <div className="payment-info-row">
            <span>Fecha de Cita:</span>
            <span>{formatDate(paymentData.appointment_date)}</span>
          </div>
        )}

        {paymentData.description && (
          <div
            className="payment-info-row"
            style={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            <span style={{ marginBottom: "0.25rem" }}>Descripción:</span>
            <p style={{ fontWeight: 500, color: "var(--text-primary)" }}>
              {paymentData.description}
            </p>
          </div>
        )}

        <div className="payment-info-total">
          <span>Total a Pagar:</span>
          <span>
            {formatCurrency(paymentData.amount, paymentData.currency)}
          </span>
        </div>
      </div>

      <div className="payment-info-footer">
        {/* Botón que simula el flujo de pago seguro y redirige a success/failure */}
        <Button
          variant="primary"
          fullWidth
          onClick={() => {
            // Navegación simulada: determinar éxito/fracaso (en producción esto vendría del backend/MP)
            const success = Math.random() > 0.25; // 75% prob de éxito en mock
            if (success) {
              window.location.href = `/payment/success?payment_id=${encodeURIComponent(
                paymentData.id || ""
              )}&external_reference=${encodeURIComponent(
                paymentData.appointment_id || ""
              )}`;
            } else {
              window.location.href = `/payment/failure?error=${encodeURIComponent(
                "Transacción rechazada"
              )}&payment_id=${encodeURIComponent(paymentData.id || "")}`;
            }
          }}
        >
          Pago seguro
        </Button>
      </div>
    </Card>
  );
};

export default PaymentInfo;
