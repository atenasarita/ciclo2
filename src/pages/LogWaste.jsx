import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../styles/logwaste-styles.css';

const tiposResiduos = [
  'Trapos, guantes y textiles contaminados con aceite hidráulico, pintura, thinner y grasa...',
  'Plásticos contaminados con aceite hidráulico y pintura...',
  'Papel contaminado con pintura proveniente de la actividad de retoque de carrocerías',
  'Tambos vacíos metálicos contaminados con aceite hidráulico, líquidos para frenos y sello',
  'Tambos vacíos plásticos contaminados limpiadores con base de hidróxido de potasio',
  'Lodos de Fosfatizado proveniente de la lavadora de fosfatizado',
  'Contenedores vacíos metálicos contaminados de pintura de aceite, aceite hidráulico y sello',
  'Contenedores vacíos plásticos contaminados de pintura de aceite y aceite hidráulico',
  'Aceite Gastado proveniente de mantenimientos',
  'Solventes mezclados con base thinner',
  'Totes contaminados plásticos con aceite hidráulico',
  'Agua contaminada con pintura',
  'Filtros contaminados con pigmentos y agua (Planta tratadora)',
  'Sello gastado de aplicación a carcazas',
  'Residuos no anatómicos de curaciones',
  'Objetos punzocortantes médicos',
  'Pilas alcalinas',
  'Baterías de equipos automotores',
  'Lodos de clara (residuos casetas pintura)',
  'Rebaba y eslinga metálica impregnada con aceite',
  'Lámparas fluorescentes',
  'Filtros contaminados con pigmentos y agua (Planta pintura)',
  'Contenedores metálicos de gases refrigerantes',
  'Catalizadores gastados de equipos automotores',
  'Baterías automotrices de litio metálico'
];

const quimicos = ['C', 'R', 'E', 'T', 'Te', 'Th', 'Tt', 'I', 'B', 'M'];
const contenedores = ['Paca', 'Pieza', 'Tambo', 'Tarima', 'Tote'];
const areas = ['Assembly', 'HO', 'Paint', 'PTAR', 'Stamping', 'Utility', 'Vendors', 'Welding'];
const disposiciones = ['Confinamiento', 'Coprocesamiento', 'Reciclaje'];
const razonesSociales = ['LAURA MIREYA NAVARRO CEPEDA', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'CONDUGAS DEL NORESTE S.A. DE C.V.'];
const semarnatAut = ['19-I-030-D-19', '19-I-001-D-16', '19-I-009-D-18', '19-I-031-D-19'];
const sctAut = ['1938SAI07062011230301029', '1938CNO08112011230301036', '1938ESG28112011230301000', '1938NACL13102022230303000', '1938NACL29052015073601001'];
const destinoRS = ['BARRILES METALICOS S.A. de C.V.', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'ECOQUIM S.A. DE C.V.', 'MAQUILADORA DE LUBRICANTES S.A. DE C.V.', 'ELECTRICA AUTOMOTRIZ OMEGA S.A. DE C.V.'];
const destinoAut = ['19-V-62-16', '19-II-004-D-2020', '19-IV-69-16', '19-IV-21-18', '19-21-PS-V-04-94'];
const responsable = ['Yamileth Cuellar'];

export default function LogWaste() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item: 1,
    usuario: '',
    date: '',
    ingreso: '',
    salida: '',
    type: '',
    amount: '',
    unit: 'Ton',
    container: '',
    area: '',
    art71: '',
    razon: '',
    autSemarnat: '',
    autSCT: '',
    razonDestino: '',
    autDestino: '',
    quimicos: [],
    observations: '',
    responsable: '',
  });

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: hoy }));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updated = checked
        ? [...formData.quimicos, value]
        : formData.quimicos.filter(q => q !== value);
      setFormData(prev => ({ ...prev, quimicos: updated }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    generatePDF(formData);
    saveToLocalStorage(formData);
    setFormData(prev => ({ ...prev, item: prev.item + 1 }));
  };

  const generatePDF = data => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Bitácora de Residuos Peligrosos', 20, 20);
    let y = 30;
    Object.entries(data).forEach(([key, value]) => {
      const val = Array.isArray(value) ? value.join(', ') : value;
      doc.text(`${key}: ${val}`, 20, y);
      y += 10;
    });
    doc.save(`RP_${data.item || '0000'}.pdf`);
  };

  const saveToLocalStorage = data => {
    const current = JSON.parse(localStorage.getItem('residuoHistorial')) || [];
    localStorage.setItem('residuoHistorial', JSON.stringify([...current, data]));
  };

  return (
    <div className="logwaste-container">
      <Link to="/sessionstarted">
        <img className="logwaste-go-back" src={process.env.PUBLIC_URL + '/assets/go-back.png'} alt="Volver" />
      </Link>
      <div className="logwaste-form-box">
        <h2>Registrar Residuo Peligroso</h2>
        <form className="logwaste-form" onSubmit={handleSubmit}>
          <div className="input-wrapper"><label>Item</label><input name="item" type="number" value={formData.item} disabled /></div>
          <div className="input-wrapper"><label>Usuario</label><input name="usuario" value={formData.usuario} onChange={handleChange} /></div>
          <div className="input-wrapper"><label>Fecha de registro</label><input type="date" name="date" value={formData.date} disabled /></div>

          <div className="input-wrapper"><label>Fecha de ingreso</label><input type="date" name="ingreso" value={formData.ingreso} onChange={handleChange} /></div>
          <div className="input-wrapper"><label>Fecha de salida</label><input type="date" name="salida" value={formData.salida} onChange={handleChange} /></div>
          <div className="input-wrapper"><label>Tipo de Residuo</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Selecciona</option>
              {tiposResiduos.map((res, i) => <option key={i}>{res}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Cantidad (Ton)</label><input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} /></div>
          <div className="input-wrapper"><label>Contenedor</label>
            <select name="container" value={formData.container} onChange={handleChange}>
              <option value="">Selecciona</option>
              {contenedores.map((c, i) => <option key={i}>{c}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Área o proceso de generación</label>
            <select name="area" value={formData.area} onChange={handleChange}>
              <option value="">Selecciona</option>
              {areas.map((a, i) => <option key={i}>{a}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Art. 71 fracción I inciso (e)</label>
            <select name="art71" value={formData.art71} onChange={handleChange}>
              <option value="">Selecciona</option>
              {disposiciones.map((d, i) => <option key={i}>{d}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Razón Social (Transportista)</label>
            <select name="razon" value={formData.razon} onChange={handleChange}>
              <option value="">Selecciona</option>
              {razonesSociales.map((r, i) => <option key={i}>{r}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Autorización SEMARNAT</label>
            <select name="autSemarnat" value={formData.autSemarnat} onChange={handleChange}>
              <option value="">Selecciona</option>
              {semarnatAut.map((a, i) => <option key={i}>{a}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Autorización SCT</label>
            <select name="autSCT" value={formData.autSCT} onChange={handleChange}>
              <option value="">Selecciona</option>
              {sctAut.map((s, i) => <option key={i}>{s}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Razón Social (Destino)</label>
            <select name="razonDestino" value={formData.razonDestino} onChange={handleChange}>
              <option value="">Selecciona</option>
              {destinoRS.map((r, i) => <option key={i}>{r}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Autorización (Destino)</label>
            <select name="autDestino" value={formData.autDestino} onChange={handleChange}>
              <option value="">Selecciona</option>
              {destinoAut.map((d, i) => <option key={i}>{d}</option>)}
            </select>
          </div>
          <div className="input-wrapper"><label>Responsable Técnico</label>
            <select name="responsable" value={formData.responsable} onChange={handleChange}>
              <option value="">Selecciona</option>
              {responsable.map((r, i) => <option key={i}>{r}</option>)}
            </select>
          </div>
          <div className="input-wrapper full"><label>Observaciones</label>
            <textarea name="observations" value={formData.observations} onChange={handleChange} />
          </div>
          <div className="input-wrapper full"><label>Químicos (CRETI)</label>
            <div className="checkbox-group">
              {quimicos.map(q => (
                <label key={q}>
                  <input type="checkbox" name="quimicos" value={q} onChange={handleChange} checked={formData.quimicos.includes(q)} /> {q}
                </label>
              ))}
            </div>
          </div>
          <div className="logwaste-btns">
            <button type="submit" className="logwaste-submit-btn">Generar Nota PDF</button>
            <button type="button" className="logwaste-history-btn" onClick={() => navigate('/historyview')}>Ver Historial</button>
          </div>
        </form>
      </div>
    </div>
  );
}