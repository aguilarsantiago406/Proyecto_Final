import React from "react";
import { Link } from "react-router-dom";
import CosmosParticles from "../components/common/CosmosParticles";

const Home = () => {
  return (
    <div className="hero-root" data-testid="home-page">
      <CosmosParticles />
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
              Transforma tu flujo de trabajo de pagos con nuestra integración
              completa. Conecta, procesa y reconcilia pagos automáticamente.
            </p>

            <div className="hero-ctas">
              <Link
                to="/admin/login"
                className="btn btn-lg btn-primary hero-cta"
              >
                Comenzar Ahora
              </Link>
              <a href="#docs" className="btn btn-lg btn-outline hero-cta">
                Ver documentación
              </a>
            </div>
          </div>
        </div>

        <section id="features" className="features-section">
          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Integración Automática</h3>
              <p>
                Conecta GoHighLevel y Mercado Pago en minutos con OAuth 2.0
                seguro.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Pagos Seguros</h3>
              <p>
                Procesa pagos con la seguridad y cumplimiento que tu negocio
                necesita.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Reconciliación Diaria</h3>
              <p>
                Reportes automáticos y conciliación financiera sin intervención
                manual.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Multicliente</h3>
              <p>
                Gestiona múltiples subcuentas desde un único panel
                administrativo.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🔁</div>
              <h3>Webhooks en Tiempo Real</h3>
              <p>Actualizaciones instantáneas del estado de pagos en GHL.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Instalación Privada</h3>
              <p>
                Apps privadas por invitación, listas para comercializar con tu
                marca.
              </p>
            </article>
          </div>
        </section>

        <section id="why" className="hero-why">
          <h2>
            ¿Por qué <span className="accent">RP Pagos</span> ?
          </h2>
          <div className="why-grid">
            <div className="why-item">
              Autenticación OAuth segura para GHL y Mercado Pago
            </div>
            <div className="why-item">
              Generación de enlaces de pago desde GHL
            </div>
            <div className="why-item">
              Actualización automática de estado en GHL
            </div>
            <div className="why-item">
              Panel administrativo con métricas en tiempo real
            </div>
            <div className="why-item">Exportación de informes en CSV/JSON</div>
            <div className="why-item">
              Webhooks automatizados y reglas inteligentes
            </div>
          </div>
        </section>

        <section className="hero-cta-invite">
          <div className="cta-invitation">
            <h3>
              Listo para <strong>Despegar</strong>?
            </h3>
            <p>
              Únete a agencias y empresas que ya están automatizando sus pagos
              con nuestra plataforma de integración profesional.
            </p>
            <div className="cta-actions">
              <Link to="/admin/login" className="btn btn-primary">
                Instalar App Privada
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
