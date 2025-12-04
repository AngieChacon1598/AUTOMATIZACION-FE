import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportesService } from '../../shared/api/apiService';

const COLORS = ['#00C49F', '#FF8042'];
const ESTADO_LABELS = { 'A': 'Activo', 'I': 'Inactivo' };

const ReporteEgresadosPorEstado = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await reportesService.getEgresadosPorEstado();
        console.log('📊 ReporteEgresadosPorEstado - Resultado:', result);
        
        if (result.success) {
          let rawData = result.data.reporte || result.data || [];
          
          // Si es un array, procesarlo; si no, convertir a array
          if (!Array.isArray(rawData)) {
            rawData = [];
          }
          
          console.log('📊 ReporteEgresadosPorEstado - Datos sin procesar:', rawData);
          
          // Mapear los datos al formato esperado por el gráfico
          const processedData = rawData.map(d => {
            const estado = ESTADO_LABELS[d.estado] || d.estado || 'Desconocido';
            const cantidad = d.cantidad || d.total || d.count || 0;
            
            return {
              estado: estado,
              cantidad: cantidad
            };
          });
          
          console.log('📊 ReporteEgresadosPorEstado - Datos procesados:', processedData);
          setData(processedData);
        } else {
          setError(result.error || 'Error al cargar los datos');
        }
      } catch (err) {
        console.error('❌ Error en ReporteEgresadosPorEstado:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando datos...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666' }}>No hay datos para mostrar.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2 style={{ textAlign: 'center' }}>Egresados por Estado</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="cantidad"
            nameKey="estado"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ estado, percent }) => `${estado}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReporteEgresadosPorEstado; 