import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/history-view-styles.css';
import jsPDF from 'jspdf';

export default function HistoryView() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('residuoHistorial')) || [];
    setRecords(stored);
    setFiltered(stored);
  }, []);

  useEffect(() => {
    let data = records;
    if (typeFilter) data = data.filter(item => item.type === typeFilter);
    if (dateFilter) data = data.filter(item => item.date === dateFilter);
    setFiltered(data);
  }, [typeFilter, dateFilter, records]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Historial de Residuos Peligrosos', 20, 20);

    let y = 40;
    filtered.forEach((record, index) => {
      doc.setFontSize(12);
      doc.text(`Registro #${index + 1}`, 20, y);
      y += 10;
      doc.text(`Date: ${record.date}`, 20, y);
      y += 10;
      doc.text(`Type: ${record.type} | Cantidad: ${record.amount} ${record.unit}`, 20, y);
      y += 10;
      doc.text(`Contenedor: ${record.container} | Destino: ${record.destination}`, 20, y);
      y += 10;
      doc.text(`Obs: ${record.observations || 'N/A'}`, 20, y);
      y += 15;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('historial_residuos.pdf');
  };

  const handleDelete = (indexToDelete) => {
    const updatedRecords = records.filter((_, index) => index !== indexToDelete);
    setRecords(updatedRecords);
    localStorage.setItem('residuoHistorial', JSON.stringify(updatedRecords));
  };

  return (
    <div className="history-container">
      <Link to="/logwaste">
        <img
          className='logwaste-go-back'
          src={process.env.PUBLIC_URL + '/assets/go-back.png'}
          alt="Volver"
        />
      </Link>

      <h1>Historial de Registros</h1>

      <div className="filters">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value=''>Todos los tipos</option>
          <option value='Aceite usado'>Aceite usado</option>
          <option value='Solvente'>Solvente</option>
          <option value='Baterías'>Baterías</option>
          <option value='Lámparas'>Lámparas</option>
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        <button onClick={handleExportPDF}>Exportar a PDF</button>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Contenedor</th>
            <th>Destino</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.type}</td>
                <td>{entry.amount} {entry.unit}</td>
                <td>{entry.container}</td>
                <td>{entry.destination}</td>
                <td>{entry.observations}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">No hay registros para mostrar</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}