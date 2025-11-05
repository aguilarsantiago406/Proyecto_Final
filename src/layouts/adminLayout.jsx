import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CosmosParticles from "../components/common/CosmosParticles";
import { useAuth } from "../hooks/useAuth";
import AdminNavbar from "../components/admin/AdminNavBar";
import Sidebar from "../components/admin/Sidebar";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AdminLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="page-loader">
        <LoadingSpinner size="lg" message="Cargando..." />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div
      className="admin-layout"
      data-testid="admin-layout"
      style={{ position: "relative", zIndex: 1 }}
    >
      <CosmosParticles />
      <AdminNavbar />
      <div className="admin-layout-content">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-main-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
