import React, { useState } from 'react';
import { formatRelativeDate } from '../../utils/dateUtils';
import { getLogEventIcon } from '../../utils/statusUtils'; 
import Button from '../common/Button';

const LogFeed = ({ logs, onExport }) => {
  const [filter, setFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  
  const getLogEventClass = (event) => {
    const colors = {
      payment_approved: 'log-event-approved',
      payment_rejected: 'log-event-rejected',
      payment_link_created: 'log-event-created',
      ghl_sync: 'log-event-sync',
      webhook_received: 'log-event-webhook',
      error: 'log-event-rejected',
    };
    return colors[event] || 'log-event-default';
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.event === filter;
  });
  
  const handleExport = async () => {
    setIsExporting(true);
    try { await onExport(); } 
    catch (error) { console.error('Error al exportar logs:', error); } 
    finally { setIsExporting(false); }
  };
  
  return (
    <div className="table-wrapper" data-testid="log-feed">
      <div className="table-filter-bar">
        <h3>Logs de Auditoría</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          loading={isExporting}
          data-testid="export-logs-button"
        >
          <svg width="16" height="16" style={{marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar Logs
        </Button>
      </div>
      <div className="table-filter-bar" style={{justifyContent: 'flex-start'}}>
        <div className="table-filter-controls">
          <label>Filtrar:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            data-testid="log-event-filter"
          >
            <option value="all">Todos los eventos</option>
            <option value="payment_approved">Pagos aprobados</option>
            <option value="payment_rejected">Pagos rechazados</option>
            <option value="payment_link_created">Links creados</option>
            <option value="ghl_sync">Sincronización GHL</option>
            <option value="webhook_received">Webhooks recibidos</option>
          </select>
        </div>
      </div>
      
      <div className="log-feed">
        {filteredLogs.length === 0 ? (
          <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
            <p>No hay logs para mostrar</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="log-entry" data-testid={`log-entry-${log.id}`}>
              <div className="log-icon">
                <span>{getLogEventIcon(log.event)}</span>
              </div>
              <div className="log-content">
                <div className="log-content-header">
                  <div style={{flex: 1}}>
                    <p className={`log-message ${getLogEventClass(log.event)}`}>
                      {log.message}
                    </p>
                  </div>
                  <span className="log-timestamp">
                    {formatRelativeDate(log.timestamp)}
                  </span>
                </div>
                {log.user_id && (
                  <p className="log-user">
                    Usuario: {log.user_id}
                  </p>
                )}
                {log.details && Object.keys(log.details).length > 0 && (
                  <details className="log-details">
                    <summary>Ver detalles</summary>
                    <pre>{JSON.stringify(log.details, null, 2)}</pre>
                  </details>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="table-footer">
        <p>
          Mostrando <span>{filteredLogs.length}</span> de <span>{logs.length}</span> logs
        </p>
      </div>
    </div>
  );
};
export default LogFeed;