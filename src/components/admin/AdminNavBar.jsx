import React from 'react';
import { useAuth } from '../../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <nav className="admin-navbar" data-testid="admin-navbar">
      <div className="admin-navbar-content">
        <div className="admin-navbar-logo">
          <div className="public-logo"> 
            <span>RP</span>
          </div>
          <div className="public-header-title"> 
            <h1>RP Pagos</h1>
            <p>Panel Administrativo</p>
          </div>
        </div>
        
        <div className="admin-navbar-user">
          <div className="admin-navbar-user-info">
            <p className="name">
              {user?.name || 'Administrador'}
            </p>
            <p className="email">{user?.email || 'admin@rppagos.com'}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <svg width="16" height="16" style={{marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;