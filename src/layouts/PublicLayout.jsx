import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import CosmosParticles from "../components/common/CosmosParticles";

const PublicLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  return (
    <div
      className={`public-layout ${isHome ? "home-layout" : ""}`}
      data-testid="public-layout"
      style={{ position: "relative", zIndex: 1 }}
    >
      <CosmosParticles />
      <header
        className={`public-header ${isHome ? "public-header--separated" : ""}`}
      >
        <div className="public-header-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="public-logo">
              <span>RP</span>
            </div>
            <div className="public-header-title">
              <h1>RP Pagos</h1>
              <p>Sistema de Pagos Seguro</p>
            </div>
          </div>

          <nav className="public-nav">
            <Link to="/" className="public-nav-link">
              Inicio
            </Link>
          </nav>

          <div className="public-header-actions">
            <Link to="#" className="btn btn-primary">
              Comandante
            </Link>
          </div>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <p>© 2025 RP Pagos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
