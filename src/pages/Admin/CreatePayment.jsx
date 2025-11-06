// src/pages/admin/CreatePayment.jsx
import React, { useState } from 'react';
import adminService from '../../api/adminService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const CreatePayment = () => {
  // 1. Estado para el formulario
  const [formData, setFormData] = useState({
    appointmentId: '',
    contactId: '',
    amount: '',
    description: '',
    clientName: '' // Campo extra solo para mostrarlo bonito en el link
  });
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedLink(null);

    try {
      // 2. Llamamos al backend para obtener el ID de Mercado Pago REAL
      // Nota: Enviamos solo lo que el backend espera técnicamente
      const response = await adminService.createPaymentLink({
        appointmentId: formData.appointmentId,
        contactId: formData.contactId,
        amount: parseFloat(formData.amount),
        description: formData.description
      });

      // 3. Extraemos el ID de preferencia de Mercado Pago de la respuesta
      // Ajusta esto según cómo responda exactamente tu backend (puede ser 'id', 'preference_id', etc.)
      const prefId = response.mp_preference_id || response.id || response.preference_id;

      if (!prefId) {
        throw new Error('El backend no devolvió un ID de preferencia válido.');
      }

      // 4. CONSTRUIMOS EL ENLACE "INTELIGENTE"
      // Este enlace lleva a TU frontend, pero incluye todos los datos en la URL
      const baseUrl = window.location.origin; // ej: http://localhost:5173
      const params = new URLSearchParams({
        client: formData.clientName || 'Cliente',
        amount: formData.amount,
        desc: formData.description,
        pref_id: prefId // ¡Lo más importante!
      });

      const finalLink = `${baseUrl}/pay/${formData.appointmentId}?${params.toString()}`;
      setGeneratedLink(finalLink);

    } catch (err) {
      console.error(err);
      setError('Error al generar el pago. Verifica que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("¡Link copiado!");
  };

  return (
    <div data-testid="create-payment-page">
      <div className="page-header">
        <h1>Generar Link de Pago</h1>
        <p>Crea una orden de pago y obtén un enlace para enviar al cliente.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        {/* --- Formulario --- */}
        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{marginBottom: '0.5rem', color: 'var(--color-primary)'}}>Datos Técnicos (Backend)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="ID Cita (Appointment)" name="appointmentId" value={formData.appointmentId} onChange={handleChange} required placeholder="Ej: APPT_001" />
              <Input label="ID Contacto (GHL)" name="contactId" value={formData.contactId} onChange={handleChange} required placeholder="Ej: CONT_123" />
            </div>

            <h3 style={{marginBottom: '0.5rem', marginTop: '1rem', color: 'var(--color-primary)'}}>Datos para el Cliente</h3>
            <Input label="Nombre del Cliente (Visual)" name="clientName" value={formData.clientName} onChange={handleChange} required placeholder="Ej: Juan Pérez" />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <Input label="Monto (S/)" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} required placeholder="150.00" />
              <Input label="Descripción del Servicio" name="description" value={formData.description} onChange={handleChange} required placeholder="Ej: Consulta Dental" />
            </div>

            {error && <div className="error-message"><p>{error}</p></div>}
            
            <Button type="submit" variant="primary" fullWidth loading={loading} style={{marginTop: '1rem'}}>
              Generar Link
            </Button>
          </form>
        </Card>

        {/* --- Resultado --- */}
        <div>
           {generatedLink && (
            <Card style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e', border: '1px solid' }}>
              <h3 style={{ color: '#15803d', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                ✅ ¡Link Generado!
              </h3>
              <p style={{ marginBottom: '0.5rem', color: '#166534' }}>
                Envía este enlace a tu cliente:
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input 
                  readOnly 
                  value={generatedLink} 
                  style={{ 
                    flex: 1, padding: '0.5rem', borderRadius: '0.5rem', 
                    border: '1px solid #22c55e', backgroundColor: 'white',
                    fontFamily: 'monospace', fontSize: '0.875rem'
                  }} 
                />
                <Button onClick={copyToClipboard} variant="primary" size="sm">Copiar</Button>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#166534' }}>
                <p>ℹ️ Al abrir este link, el cliente verá los detalles y podrá pagar en Mercado Pago.</p>
                <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-primary)', marginTop: '0.5rem', display: 'inline-block'}}>
                  Probar enlace (abre en nueva pestaña) →
                </a>
              </div>
            </Card>
          )}
          
          {!generatedLink && (
            <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', backgroundColor: '#f9fafb', border: '2px dashed #e5e7eb' }}>
              <p style={{ color: 'var(--text-secondary)' }}>El link generado aparecerá aquí.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;