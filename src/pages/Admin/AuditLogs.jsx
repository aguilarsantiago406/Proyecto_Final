import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import adminService from '../../api/adminService'; 
import LogFeed from '../../components/admin/LogFeed'; 
import LoadingSpinner from '../../components/common/LoadingSpinner'; 

const AuditLogs = () => {
  const { data, loading, error, execute } = useApi(adminService.getLogs);

  useEffect(() => { execute(); }, [execute]);

  const handleExportLogs = async () => {
    try {
      const blob = await adminService.exportLogs(new Date().toISOString().split('T')[0]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_rppagos_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      window.showToast('Logs exportados correctamente', 'success');
    } catch (err) {
      window.showToast('Error al exportar logs', 'error');
      console.error(err);
    }
  };

  if (loading && !data) {
    return (
      <div className="page-loader">
        <LoadingSpinner size="lg" message="Cargando logs de auditoría..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{textAlign: 'center', padding: '3rem', color: 'var(--color-error)'}}>
        <p>Error al cargar los logs: {error.message}</p>
      </div>
    );
  }

  return (
    <div data-testid="audit-logs-page">
      <div className="page-header">
        <h1>Logs de Auditoría</h1>
        <p>Registro de eventos críticos del sistema.</p>
      </div>

      <LogFeed 
        logs={data?.logs || []} 
        onExport={handleExportLogs} 
      />
    </div>
  );
};

export default AuditLogs;