import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="public-layout" data-testid="public-layout">
      <header className="public-header">
        <div className="public-header-content">
          <div className="public-logo">
            <span>RP</span>
          </div>
          <div className="public-header-title">
            <h1>RP Pagos</h1>
            <p>Sistema de Pagos Seguro</p>
          </div>
        </div>
      </header>
      
      <main className="public-main">
        <Outlet />
      </main>
      
      <footer className="public-footer">
        <p>
          © 2025 RP Pagos. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default PublicLayout;