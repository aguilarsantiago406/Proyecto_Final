// src/pages/admin/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- Importamos Link
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { isNotEmpty } from '../../utils/validators';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!isNotEmpty(username)) newErrors.username = 'El usuario es requerido';
    if (!isNotEmpty(password)) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrors({ general: result.message || 'Credenciales incorrectas' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión con el servidor.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-container" data-testid="login-page">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo"><span>RP</span></div>
          <h1>RP Pagos</h1>
          <p>Panel Administrativo</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Usuario" 
              type="text"
              placeholder="alice"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            {errors.general && (
              <div className="error-message"><p>{errors.general}</p></div>
            )}
            <Button type="submit" variant="primary" size="lg" fullWidth={true} loading={isLoading}>
              Iniciar Sesión
            </Button>
          </form>
        </Card>

        {/* --- NUEVO: Botón Volver al Inicio --- */}
        <div className="login-footer" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <Link 
            to="/" 
            style={{ 
              color: 'var(--color-primary)', 
              textDecoration: 'none', 
              fontWeight: 500
            }}
          >
            ← Volver a la Página Principal
          </Link>
          <p style={{ margin: 0 }}>© 2025 RP Pagos. Integración GHL + Mercado Pago</p>
        </div>
      </div>
    </div>
  );
};
export default Login;