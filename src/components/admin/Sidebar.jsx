import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Historial de Pagos',
      path: '/admin/payments',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      name: 'Logs de Auditoría',
      path: '/admin/logs',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];
  
  return (
    <aside className="sidebar" data-testid="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-menu-title">
          Menú Principal
        </h2>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                "sidebar-nav-link" + (isActive ? " active" : "")
              }
              data-testid={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Sección inferior con información adicional */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-box">
          <p>🔗 Integración</p>
          <div className="sidebar-footer-status">
            <div className="status-dot"></div>
            <p className="status-text">GHL + Mercado Pago</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;