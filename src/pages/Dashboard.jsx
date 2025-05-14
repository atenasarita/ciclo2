import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/dashboards-styles.css';

const COLORS = ['#38bdf8', '#0ea5e9', '#94a3b8', '#10b981'];

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [containerFilter, setContainerFilter] = useState('');
  const dashboardRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('residuoHistorial')) || [];
    setRecords(stored);
    setFiltered(stored);
  }, []);

  useEffect(() => {
    let data = records;
    if (typeFilter) data = data.filter(r => r.type === typeFilter);
    if (containerFilter) data = data.filter(r => r.container === containerFilter);
    setFiltered(data);
  }, [typeFilter, containerFilter, records]);

  const groupedByMonth = filtered.reduce((acc, record) => {
    const month = record.date?.slice(0, 7);
    if (!acc[month]) acc[month] = 0;
    acc[month] += parseFloat(record.amount);
    return acc;
  }, {});
  const monthlyData = Object.entries(groupedByMonth).map(([month, total]) => ({ month, total }));

  const typeDistribution = filtered.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + parseFloat(r.amount);
    return acc;
  }, {});
  const pieData = Object.entries(typeDistribution).map(([name, value]) => ({ name, value }));

  const containerData = filtered.reduce((acc, r) => {
    acc[r.container] = (acc[r.container] || 0) + parseFloat(r.amount);
    return acc;
  }, {});
  const barData = Object.entries(containerData).map(([name, value]) => ({ name, value }));

  const totalLogged = filtered.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const avgPerMonth = monthlyData.length ? (totalLogged / monthlyData.length).toFixed(2) : 0;
  const topWaste = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Environmental KPI Dashboard Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Waste Logged: ${totalLogged.toFixed(1)} kg`, 20, 40);
    doc.text(`Average per Month: ${avgPerMonth} kg`, 20, 50);
    doc.text(`Most Logged Type: ${topWaste}`, 20, 60);
    doc.save('dashboard_report.pdf');
  };

  const handleExportImage = () => {
    html2canvas(dashboardRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'dashboard_snapshot.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const tableData = Object.entries(typeDistribution).map(([type, value]) => ({
    type,
    value: parseFloat(value.toFixed(1)),
    isHighlighted: type === typeFilter
  }));

  return (
    <div className="dashboard-wrapper" ref={dashboardRef}>
      <Link to="/sessionstarted">
        <img className="dashboard-go-back" src={process.env.PUBLIC_URL + '/assets/go-back.png'} alt="Volver" />
      </Link>

      <aside className="dashboard-sidebar">
        <h2>Filtros</h2>
        <div className="input-wrapper">
          <label>Tipo de Residuo</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Todos</option>
            {Array.from(new Set(records.map(r => r.type))).map((type, i) => (
              <option key={i}>{type}</option>
            ))}
          </select>
        </div>

        <div className="input-wrapper">
          <label>Contenedor</label>
          <select value={containerFilter} onChange={e => setContainerFilter(e.target.value)}>
            <option value="">Todos</option>
            {Array.from(new Set(records.map(r => r.container))).map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </select>
        </div>

        <button onClick={handleExportPDF}>Exportar PDF</button>
        <button onClick={handleExportImage}>Exportar Imagen</button>
      </aside>

      <main className="dashboard-main">
        <section className="kpi-cards">
          <div className="kpi-card">Total Registrado <span>{totalLogged.toFixed(1)} kg</span></div>
          <div className="kpi-card">Prom. por Mes <span>{avgPerMonth} kg</span></div>
          <div className="kpi-card">Residuo Principal <span>{topWaste}</span></div>
        </section>

        <div className="graph-card">
          <h3>Comparación Mensual</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-card">
          <h3>Residuos por Contenedor</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-card">
          <h3>Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-card table-card">
          <h3>Totales por Tipo de Residuo</h3>
          <table className="type-summary-table">
            <thead>
              <tr><th>Tipo</th><th>Total (kg)</th></tr>
            </thead>
            <tbody>
              {tableData.map(({ type, value, isHighlighted }) => (
                <tr key={type} className={isHighlighted ? 'highlighted-row' : ''}>
                  <td>{type}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}