import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { reportesService } from '../../shared/api/apiService';

const ReporteEgresadosPorAnio = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await reportesService.getEgresadosPorAnio();
        console.log('📊 ReporteEgresadosPorAnio - Resultado:', result);
        
        if (result.success) {
          let rawData = result.data.reporte || result.data || [];
          
          // Si es un array, procesarlo; si no, convertir a array
          if (!Array.isArray(rawData)) {
            rawData = [];
          }
          
          console.log('📊 ReporteEgresadosPorAnio - Datos sin procesar:', rawData);
          
          // Mapear los datos al formato esperado por el gráfico
          // El backend puede devolver: {anio_egreso, total} o {anio, cantidad}
          const processedData = rawData.map(item => {
            const anio = item.anio || item.anio_egreso || item.year || 'Desconocido';
            const cantidad = item.cantidad || item.total || item.count || 0;
            
            return {
              anio: anio.toString(),
              cantidad: cantidad
            };
          });
          
          console.log('📊 ReporteEgresadosPorAnio - Datos procesados:', processedData);
          setData(processedData);
        } else {
          setError(result.error || 'Error al cargar los datos');
        }
      } catch (err) {
        console.error('❌ Error en ReporteEgresadosPorAnio:', err);
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
      <h2 style={{ textAlign: 'center' }}>Egresados por Año de Egreso</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="anio" angle={-20} textAnchor="end" interval={0} height={70} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#82ca9d">
            <LabelList dataKey="cantidad" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReporteEgresadosPorAnio; 