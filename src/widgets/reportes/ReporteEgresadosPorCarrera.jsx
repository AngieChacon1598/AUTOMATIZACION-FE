import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { reportesService } from '../../shared/api/apiService';
import { useCatalogos } from '../../shared/useApi.jsx';

const ReporteEgresadosPorCarrera = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { catalogos } = useCatalogos();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await reportesService.getEgresadosPorCarrera();
        console.log('📊 ReporteEgresadosPorCarrera - Resultado:', result);
        
        if (result.success) {
          let rawData = result.data.reporte || result.data || [];
          
          // Si es un array, procesarlo; si no, convertir a array
          if (!Array.isArray(rawData)) {
            rawData = [];
          }
          
          console.log('📊 ReporteEgresadosPorCarrera - Datos sin procesar:', rawData);
          
          // Mapear los datos al formato esperado por el gráfico
          // El backend puede devolver: {carrera_id, total} o {carrera, cantidad} o {nombre_carrera, total}
          const processedData = rawData.map(item => {
            // Función para obtener el nombre de la carrera
            const getCarreraName = () => {
              if (item.carrera) return item.carrera;
              if (item.nombre_carrera) return item.nombre_carrera;
              if (item.carrera_id && catalogos?.carrerasProfesionales) {
                const carrera = catalogos.carrerasProfesionales.find(c => c.id_carrera === item.carrera_id);
                return carrera ? carrera.nombre_carrera : `Carrera ${item.carrera_id}`;
              }
              return 'Desconocida';
            };
            
            // Función para obtener la cantidad
            const getCantidad = () => {
              return item.cantidad || item.total || item.count || 0;
            };
            
            return {
              carrera: getCarreraName(),
              cantidad: getCantidad()
            };
          });
          
          console.log('📊 ReporteEgresadosPorCarrera - Datos procesados:', processedData);
          setData(processedData);
        } else {
          setError(result.error || 'Error al cargar los datos');
        }
      } catch (err) {
        console.error('❌ Error en ReporteEgresadosPorCarrera:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [catalogos]);

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
      <h2 style={{ textAlign: 'center' }}>Egresados por Carrera</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="carrera" angle={-20} textAnchor="end" interval={0} height={70} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#8884d8">
            <LabelList dataKey="cantidad" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReporteEgresadosPorCarrera; 