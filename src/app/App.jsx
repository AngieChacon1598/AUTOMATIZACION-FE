// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../shared/AuthContext';
import {
  // Layout
  Navbar,
  // Auth
  Login,
  ProtectedRoute,
  // Dashboard
  Dashboard,
  // Egresados
  EgresadoList,
  AgregarEgresado,
  EditarEgresado,
  DetalleEgresadoList,
  AgregarDetalleEgresado,
  EditarDetalleEgresado,
  HistorialLaboral,
  // Empresas
  EmpresaList,
  EmpresaForm,
  // Certificaciones
  CertificacionList,
  CertificacionForm,
  // Reportes
  AnalyticsReportes,
  // Encuestas
  Encuestas,
  EncuestaFormulario
} from '../widgets';
import './App.css';

function App() {
  const [filter, setFilter] = useState('A');
  const [message, setMessage] = useState('');

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/egresados"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <EgresadoList
                      filter={filter}
                      setFilter={setFilter}
                      message={message}
                      setMessage={setMessage}
                    />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/egresados/nueva" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <AgregarEgresado />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/editar/:codigo"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <EditarEgresado
                      setMessage={setMessage}
                      fetchEgresados={() => window.location.reload()}
                    />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/encuestas" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <Encuestas />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/encuestas/:tipo" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <EncuestaFormulario />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/detalles" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <DetalleEgresadoList />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <AnalyticsReportes />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agregar-detalle" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <AgregarDetalleEgresado />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editar-detalle/:idDetalle" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <EditarDetalleEgresado />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/historial/:codigo" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <HistorialLaboral />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/empresas" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <EmpresaList />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/empresas/nueva" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <EmpresaForm />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/empresas/editar/:id" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <EmpresaForm />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificaciones" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <CertificacionList />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificaciones/nueva" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <CertificacionForm />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificaciones/editar/:id" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <div className="container">
                    <CertificacionForm />
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
