import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CosmosParticles from "../../components/common/CosmosParticles";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/button";
import Card from "../../components/common/Card";
import { isValidEmail, isNotEmpty } from "../../utils/validators";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!isValidEmail(email)) newErrors.email = "Email inválido";
    if (!isNotEmpty(password))
      newErrors.password = "La contraseña es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/admin");
      } else {
        setErrors({ general: result.message || "Error desconocido" });
      }
    } catch (error) {
      setErrors({
        general: error.message || "Error de conexión. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      data-testid="login-page"
      style={{ position: "relative", zIndex: 1 }}
    >
      <CosmosParticles />
      <div className="login-box">
        <div className="glass-panel">
          {/* Logo y título */}
          <div className="login-header">
            <div className="login-logo">
              <span>RP</span>
            </div>
            <h1>RP Pagos</h1>
            <p>Panel Administrativo</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label="Email"
                type="email"
                placeholder="admin@rppagos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                data-testid="login-email-input"
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                data-testid="login-password-input"
              />
              {errors.general && (
                <div className="error-message">
                  <p>{errors.general}</p>
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth={true}
                loading={isLoading}
                data-testid="login-submit-button"
              >
                Iniciar Sesión
              </Button>
            </form>
          </Card>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <a href="/" className="btn btn-ghost">
              Volver al sitio
            </a>
          </div>
        </div>

        <p className="login-footer">
          © 2025 RP Pagos. Integración GHL + Mercado Pago
        </p>
      </div>
    </div>
  );
};
export default Login;
