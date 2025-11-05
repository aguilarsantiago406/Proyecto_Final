import React from "react";
import { Link } from "react-router-dom";
import CosmosParticles from "../components/common/CosmosParticles";

const Home = () => {
  return (
    <div className="hero-root" data-testid="home-page">
      <CosmosParticles />
      
      {/* Header simple para acceso rápido admin */}
      <header style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 10
      }}>
        <Link to="/admin/login" className="btn btn-ghost" style={{ color: 'white', opacity: 0.8 }}>
          Soy Administrador →
        </Link>
      </header>

      <main className="hero-content">
        <div className="hero-area">
          <div className="hero-inner">
            <span className="hero-badge">Integración GHL ↔ Mercado Pago</span>
            <h1 className="hero-title">
              Pagos Automatizados
              <br />
              para GoHighLevel
            </h1>
            <p className="hero-sub">
              Transforma tu flujo de trabajo de pagos. Tus clientes pagan fácil, 
              tú concilias automáticamente.
            </p>

            <div className="hero-ctas" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Botón Principal: Para el Cliente */}
              <Link
                to="/portal"
                className="btn btn-lg btn-primary hero-cta"
                style={{ minWidth: '200px' }}
              >
                Ir a Pagar
              </Link>

              {/* Botón Secundario: Información/Admin */}
              <Link
                to="/admin/login"
                className="btn btn-lg btn-outline hero-cta"
                style={{ minWidth: '200px', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
              >
                Instalar App
              </Link>
            </div>
          </div>
        </div>

        <section id="features" className="features-section">
          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Integración Automática</h3>
              <p>Conecta GoHighLevel y Mercado Pago y realiza tu pago de manera segura.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Pagos Seguros</h3>
              <p>Procesa pagos con la seguridad y cumplimiento que tu negocio necesita.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Reconciliación Diaria</h3>
              <p>Reportes automáticos y conciliación financiera sin intervención manual.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Multicliente</h3>
              <p>Gestiona múltiples subcuentas desde un único panel administrativo.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">🔁</div>
              <h3>Webhooks en Tiempo Real</h3>
              <p>Actualizaciones instantáneas del estado de pagos en GHL.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Instalación Privada</h3>
              <p>Apps privadas por invitación, listas para comercializar con tu marca.</p>
            </article>
          </div>
        </section>

        <section className="hero-cta-invite">
          <div className="cta-invitation">
            <h3>¿Listo para <strong>Despegar</strong>?</h3>
            <p>Únete a agencias y empresas que ya están automatizando sus pagos.</p>
            <div className="cta-actions">
              <Link to="/admin/login" className="btn btn-primary">
                Comenzar Ahora
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;