import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi'; // <-- Ruta relativa
import adminService from '../../api/adminService'; // <-- Ruta relativa
import StatCard from '../../components/admin/StatCard'; // <-- Ruta relativa
import LoadingSpinner from '../../components/common/LoadingSpinner'; // <-- Ruta relativa
import Card from '../../components/common/Card'; // <-- Ruta relativa
import { formatCurrency, formatPercentage } from '../../utils/formatUtils'; // <-- Ruta relativa
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement );

const Dashboard = () => {
  const { data: stats, loading, execute } = useApi(adminService.getStats);
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => { execute(); }, [execute]);
  
  useEffect(() => {
    if (stats) {
      setChartData({
        line: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Pagos Aprobados',
            data: [12, 19, 15, 25, 22, 18, 20],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }],
        },
        doughnut: {
          labels: ['Aprobados', 'Pendientes', 'Rechazados'],
          datasets: [{
            data: [ stats.approved_payments, stats.pending_payments, stats.rejected_payments ],
            backgroundColor: [ 'rgb(34, 197, 94)', 'rgb(234, 179, 8)', 'rgb(239, 68, 68)' ],
          }],
        },
      });
    }
  }, [stats]);
  
  if (loading) {
    return (
      <div className="page-loader">
        <LoadingSpinner size="lg" message="Cargando estadísticas..." />
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div style={{textAlign: 'center', padding: '3rem'}}>
        <p>No se pudieron cargar las estadísticas</p>
      </div>
    );
  }
  
  return (
    <div data-testid="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Vista general del sistema de pagos</p>
      </div>

      <div className="dashboard-kpi-grid">
        <StatCard
          title="Total de Pagos"
          value={stats.total_payments}
          color="blue"
          icon={ <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> </svg> }
          subtitle={`${stats.today_payments} pagos hoy`}
        />
        <StatCard
          title="Pagos Aprobados"
          value={stats.approved_payments}
          color="green"
          icon={ <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> }
          trend={{ direction: 'up', value: formatPercentage(stats.success_rate), label: 'tasa de éxito' }}
        />
        <StatCard
          title="Pagos Pendientes"
          value={stats.pending_payments}
          color="yellow"
          icon={ <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> }
        />
        <StatCard
          title="Monto Total"
          value={formatCurrency(stats.total_amount)}
          color="purple"
          icon={ <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> }
        />
      </div>
      
      <div className="dashboard-charts-grid">
        <Card className="dashboard-chart-line chart-container">
          <h3>Pagos por Día (Semana Actual)</h3>
          {chartData?.line && <Line data={chartData.line} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
        </Card>
        
        <Card className="chart-container">
          <h3>Distribución de Pagos</h3>
          {chartData?.doughnut && <Doughnut data={chartData.doughnut} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />}
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;