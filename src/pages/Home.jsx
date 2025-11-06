// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="hero-root" data-testid="home-page">
      {/* Header simple */}
      <header style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>RP Pagos</div>
        <Link to="/admin/login" className="btn btn-ghost" style={{ color: 'white', opacity: 0.9 }}>
          Iniciar Sesión →
        </Link>
      </header>

      <main className="hero-content">
        <div className="hero-area" style={{ paddingTop: '10rem', paddingBottom: '8rem' }}>
          <div className="hero-inner">
            <span className="hero-badge">Integración Oficial GHL</span>
            <h1 className="hero-title">
              Cobra más rápido en
              <br />
              GoHighLevel
            </h1>
            <p className="hero-sub">
              La forma más segura de conectar Mercado Pago con tu CRM. 
              Automatiza cobros, reconcilia facturas y olvídate de los procesos manuales.
            </p>

            <div className="hero-ctas" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Botón Principal: Instalar (Para Agencias) */}
              <a
                href="https://marketplace.gohighlevel.com/..." // AQUÍ IRÁ TU LINK DE INSTALACIÓN REAL
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-primary hero-cta"
                style={{ minWidth: '200px' }}
              >
                Instalar App
              </a>

              {/* Botón Secundario: Login */}
              <Link
                to="/admin/login"
                className="btn btn-lg btn-outline hero-cta"
                style={{ minWidth: '200px', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
              >
                Administrador
              </Link>
            </div>
             <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              ¿Eres un cliente intentando pagar? Usa el enlace que te enviaron por correo/SMS.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;