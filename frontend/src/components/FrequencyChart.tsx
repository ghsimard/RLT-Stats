import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Grid,
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';
import { getFrequencyRatings, getYearsDistribution, getYearsDistributionForEstudiantes, getFeedbackDistribution, getScheduleDistributionForEstudiantes, getGradosEstudiantesDistribution, getScheduleDistributionForDocentes } from '../services/databaseService';
import { FrequencyData } from '../types';
import Spinner from './Spinner';
import PDFGenerationSpinner from './PDFGenerationSpinner';
import './FrequencyChart.css';
import DownloadIcon from '@mui/icons-material/Download';
import { config } from '../config';
import { GradesPieChart } from './GradesPieChart';
import { BarChart, BarChartData } from './BarChart';
import { PieChart } from './PieChart';
import { StackedBarChart } from './StackedBarChart';
import { SchoolRankingTable } from './SchoolRankingTable';

export const FrequencyChart: React.FC = () => {
  const [data, setData] = useState<FrequencyData[]>([]);
  const [yearsData, setYearsData] = useState<BarChartData[]>([]);
  const [estudiantesYearsData, setEstudiantesYearsData] = useState<BarChartData[]>([]);
  const [feedbackData, setFeedbackData] = useState<BarChartData[]>([]);
  const [estudiantesScheduleData, setEstudiantesScheduleData] = useState<BarChartData[]>([]);
  const [acudientesGradesData, setAcudientesGradesData] = useState<BarChartData[]>([]);
  const [docentesScheduleData, setDocentesScheduleData] = useState<BarChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAllPDFs, setGeneratingAllPDFs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  // Fetch available schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${config.api.baseUrl}/api/schools`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const text = await response.text();
          if (text.toLowerCase().includes('<!doctype')) {
            throw new Error('El servidor no está respondiendo correctamente. Por favor, verifica que el servidor esté en ejecución.');
          }
          throw new Error(`Error al cargar las escuelas: ${response.status} ${response.statusText}`);
        }
        
        const schoolNames = await response.json() as string[];
        
        // Remove any empty strings and trim whitespace
        const cleanSchools = schoolNames
          .map(name => name.trim())
          .filter(name => name);
        
        console.log('Schools loaded:', cleanSchools);
        setSchools(cleanSchools);
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las escuelas');
      }
    };

    fetchSchools();
  }, []);

  // Add new useEffect to filter options based on input
  useEffect(() => {
    if (inputValue.length >= 3) {
      const filtered = schools.filter(school => 
        school.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [inputValue, schools]);

  // Fetch frequency data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // If no school is selected, get overall data for all schools
        const frequencyData = await getFrequencyRatings(selectedSchool || undefined);
        console.log('Received data:', frequencyData);
        
        // Validate that frequencyData is an array
        if (!frequencyData) {
          console.error('No data received from server');
          setError('No se recibieron datos del servidor');
          setData([]);
          return;
        }
        
        if (!Array.isArray(frequencyData)) {
          console.error('Expected array but received:', typeof frequencyData);
          setError('Formato de datos inválido recibido del servidor');
          setData([]);
          return;
        }
        
        if (frequencyData.length === 0) {
          console.log('Received empty array from server');
          setData([]);
          return;
        }
        
        // Validate each item in the array
        const isValidData = frequencyData.every(item => 
          item && 
          typeof item === 'object' && 
          'title' in item && 
          'questions' in item &&
          Array.isArray(item.questions)
        );
        
        if (!isValidData) {
          console.error('Invalid data structure received:', frequencyData);
          setError('Estructura de datos inválida recibida del servidor');
          setData([]);
          return;
        }
        
        setData(frequencyData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los datos de frecuencia');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSchool]);

  // Fetch bar chart data when school changes
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        setLoading(true);
        
        // Fetch years distribution data
        const years = await getYearsDistribution(selectedSchool || 'all');
        setYearsData(years);
        
        // Fetch estudiantes years distribution data
        const estudiantesYears = await getYearsDistributionForEstudiantes(selectedSchool || 'all');
        setEstudiantesYearsData(estudiantesYears);
        
        // Fetch feedback distribution data
        const feedback = await getFeedbackDistribution(selectedSchool || 'all');
        setFeedbackData(feedback);
      } catch (err) {
        console.error('Error fetching bar chart data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los datos de gráficos');
      } finally {
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [selectedSchool]);

  // Fetch additional chart data when school changes
  useEffect(() => {
    const fetchAdditionalChartData = async () => {
      try {
        setLoading(true);
        
        // Fetch estudiantes schedule distribution
        const estudiantesSchedule = await getScheduleDistributionForEstudiantes(selectedSchool || 'all');
        setEstudiantesScheduleData(estudiantesSchedule);
        
        // Fetch acudientes grades distribution
        const acudientesGrades = await getGradosEstudiantesDistribution(selectedSchool || 'all');
        setAcudientesGradesData(acudientesGrades);
        
        // Fetch docentes schedule distribution
        const docentesSchedule = await getScheduleDistributionForDocentes(selectedSchool || 'all');
        setDocentesScheduleData(docentesSchedule);
      } catch (err) {
        console.error('Error fetching additional chart data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los datos adicionales');
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalChartData();
  }, [selectedSchool]);

  const handleSchoolChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setSelectedSchool(newValue || '');
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('Starting PDF download process');
      const apiUrl = `${config.api.baseUrl}/api/generate-pdf${selectedSchool ? `?school=${encodeURIComponent(selectedSchool)}` : ''}`;
      console.log('API URL:', apiUrl);
      
      console.log('Sending fetch request...');
      const response = await fetch(apiUrl);
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, string>),
        ok: response.ok
      });
      
      if (!response.ok) throw new Error(`Error generating PDF: ${response.status} ${response.statusText}`);
      
      // Create a blob from the response
      console.log('Creating blob from response...');
      const blob = await response.blob();
      console.log('Blob created:', {
        size: blob.size,
        type: blob.type
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      console.log('URL created:', url);
      
      // Create a temporary link element with the new filename format
      const link = document.createElement('a');
      link.href = url;
      link.download = `RLT-Informe de Encuesta-${selectedSchool}.pdf`;
      console.log('Link created with attributes:', {
        href: link.href,
        download: link.download
      });
      
      // Append the link to the document, click it, and remove it
      console.log('Triggering download...');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      console.log('Download process completed');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Error downloading PDF');
    }
  };

  // Add a function to handle generating all PDFs
  const handleGenerateAllPDFs = async () => {
    try {
      setGeneratingAllPDFs(true);
      console.log('Starting all PDFs generation process');
      const apiUrl = `${config.api.baseUrl}/api/generate-all-pdfs`;
      console.log('API URL:', apiUrl);
      
      console.log('Sending fetch request...');
      const response = await fetch(apiUrl);
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, string>),
        ok: response.ok
      });
      
      if (!response.ok) throw new Error(`Error generating PDFs: ${response.status} ${response.statusText}`);
      
      // Create a blob from the response
      console.log('Creating blob from response...');
      const blob = await response.blob();
      console.log('Blob created:', {
        size: blob.size,
        type: blob.type
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      console.log('URL created:', url);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'RLT - Informes de Encuestas.zip';
      console.log('Link created with attributes:', {
        href: link.href,
        download: link.download
      });
      
      // Append the link to the document, click it, and remove it
      console.log('Triggering download...');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      console.log('Download process completed');
      setGeneratingAllPDFs(false);
    } catch (err) {
      console.error('Error downloading all PDFs:', err);
      setError('Error al generar todos los PDFs');
      setGeneratingAllPDFs(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const ratings = ['S', 'A', 'N'] as const;
  type Rating = typeof ratings[number];
  
  const ratingLabels: Record<Rating, string> = {
    S: 'S',
    A: 'A',
    N: 'N'
  };

  const headerGroups = ['Docentes', 'Estudiantes', 'Acudientes'];

  const renderFrequencyValue = (value: number | null | undefined | string) => {
    if (value === null || value === undefined || value === "NA") {
      return '';
    }
    if (value === -1) {
      return 'Sin datos';
    }
    return `${value}%`;
  };

  const getCellStyle = (value: number | null | undefined | string, rating: string, isLastInGroup: boolean) => {
    const numValue = typeof value === 'number' ? value : parseInt(value as string);
    const shouldEmphasize = rating === 'S' && !isNaN(numValue) && numValue < 50 && numValue !== -1;
    const isNA = value === "NA" || value === null || value === undefined;
    const isNoData = value === -1;

    return {
      borderRight: isLastInGroup ? '2px solid #e0e0e0' : 'none',
      padding: '4px 8px',
      color: shouldEmphasize ? '#ffffff' : '#000000',
      ...(shouldEmphasize && {
        backgroundColor: '#000000',
        fontWeight: 'bold'
      }),
      ...(isNA && {
        backgroundImage: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 8px, #f0f0f0 8px, #f0f0f0 16px)',
        color: '#666666',
        fontStyle: 'italic'
      }),
      ...(isNoData && {
        backgroundColor: '#f5f5f5',
        color: '#666666',
        fontStyle: 'italic'
      })
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Distribución de Frecuencias
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleDownloadPDF}
            disabled={loading || !selectedSchool}
            startIcon={<DownloadIcon />}
          >
            Descargar PDF
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleGenerateAllPDFs}
            disabled={loading || generatingAllPDFs}
            startIcon={!generatingAllPDFs ? <DownloadIcon /> : undefined}
            sx={{ 
              minWidth: generatingAllPDFs ? '200px' : '180px',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {generatingAllPDFs ? <PDFGenerationSpinner /> : 'Generar todos los PDFs'}
          </Button>
        </Box>
      </Box>
      
      {/* Replace FormControl with Autocomplete */}
      <Autocomplete
        id="school-autocomplete"
        options={inputValue.length >= 3 ? filteredOptions : []}
        value={selectedSchool}
        onChange={handleSchoolChange}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Escuela"
            fullWidth
            placeholder="Escriba al menos 3 caracteres para buscar"
          />
        )}
        noOptionsText={inputValue.length < 3 ? "Escriba al menos 3 caracteres" : "No hay resultados"}
        freeSolo
      />

      {!selectedSchool && data.length > 0 && (
        <>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Datos Generales de Todas las Escuelas
            </Typography>
            <Typography variant="body1" gutterBottom>
              Mostrando estadísticas consolidadas de todas las instituciones educativas en la base de datos.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Seleccione una escuela específica para ver datos detallados de esa institución.
            </Typography>
          </Box>
          
          {/* Section for Docentes */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#1E3A8A', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                DOCENTES
              </Typography>
            </Paper>
          </Box>

          {/* Pie Charts for Docentes */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <GradesPieChart school="all" type="docentes" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <PieChart 
                  data={docentesScheduleData} 
                  title="¿En qué jornada tiene clases?" 
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Bar Charts for Docentes */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <BarChart 
                  data={yearsData} 
                  title="¿Cuántos años lleva en la IE?" 
                  horizontal={true}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <BarChart 
                  data={feedbackData} 
                  title="Usted recibe retroalimentación de" 
                  horizontal={true}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Section for Estudiantes */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#1E3A8A', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                ESTUDIANTES
              </Typography>
            </Paper>
          </Box>

          {/* Pie Charts for Estudiantes */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <GradesPieChart school="all" type="estudiantes" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <PieChart 
                  data={estudiantesScheduleData} 
                  title="¿En qué jornada tiene clases?"
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Bar Chart for Estudiantes Years */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <BarChart 
                  data={estudiantesYearsData} 
                  title="¿Cuántos años lleva en la IE?" 
                  horizontal={true}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Section for Acudientes */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#1E3A8A', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                ACUDIENTES
              </Typography>
            </Paper>
          </Box>

          {/* Pie Chart for Acudientes */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    ¿En qué grado se encuentran los estudiantes que representa?
                  </Typography>
                  <StackedBarChart data={acudientesGradesData} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {selectedSchool && (
        <>
          {/* Section for Docentes */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#1E3A8A', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                DOCENTES
              </Typography>
            </Paper>
          </Box>

          {/* Pie Charts for Docentes */}
        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <GradesPieChart school={selectedSchool} type="docentes" />
            </Paper>
          </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <PieChart 
                  data={docentesScheduleData} 
                  title="¿En qué jornada tiene clases?" 
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Bar Charts for Docentes */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <BarChart 
                  data={yearsData} 
                  title="¿Cuántos años lleva en la IE?" 
                  horizontal={true}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <BarChart 
                  data={feedbackData} 
                  title="Usted recibe retroalimentación de" 
                  horizontal={true}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Section for Estudiantes */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#1E3A8A', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                ESTUDIANTES
              </Typography>
            </Paper>
          </Box>

          {/* Pie Charts for Estudiantes */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <GradesPieChart school={selectedSchool} type="estudiantes" />
            </Paper>
          </Grid>
            <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <PieChart 
                  data={estudiantesScheduleData} 
                  title="¿En qué jornada tiene clases?"
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Bar Chart for Estudiantes Years */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <BarChart 
                  data={estudiantesYearsData} 
                  title="¿Cuántos años lleva en la IE?" 
                  horizontal={true}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Section for Acudientes */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#1E3A8A', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                ACUDIENTES
              </Typography>
            </Paper>
          </Box>

          {/* Pie Chart for Acudientes */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    ¿En qué grado se encuentran los estudiantes que representa?
                  </Typography>
                  <StackedBarChart data={acudientesGradesData} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {Array.isArray(data) && data.map((section, sectionIndex) => (
        <Box key={sectionIndex} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
            {section.title}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      width: '40%', 
                      borderRight: '2px solid #e0e0e0',
                      padding: '8px',
                      textAlign: 'center'
                    }}
                  >
                    Item de la encuesta
                  </TableCell>
                  {headerGroups.map((group, index) => (
                    <TableCell 
                      key={group}
                      align="center" 
                      colSpan={3} 
                      sx={{ 
                        fontWeight: 'bold', 
                        width: '20%',
                        borderRight: index < headerGroups.length - 1 ? '2px solid #e0e0e0' : 'none',
                        backgroundColor: '#f5f5f5',
                        padding: '8px'
                      }}
                    >
                      {group}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderRight: '2px solid #e0e0e0', padding: '8px' }} />
                  {headerGroups.map((group, groupIndex) => (
                    <React.Fragment key={group}>
                      {ratings.map((rating, ratingIndex) => (
                        <TableCell 
                          key={`${group}-${rating}`} 
                          align="center" 
                          sx={{ 
                            fontWeight: 'bold',
                            borderRight: ratingIndex === 2 && groupIndex < headerGroups.length - 1 ? '2px solid #e0e0e0' : 'none',
                            padding: '8px'
                          }}
                        >
                          {ratingLabels[rating]}
                        </TableCell>
                      ))}
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {section.questions?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        borderRight: '2px solid #e0e0e0',
                        padding: '8px'
                      }}
                    >
                      {item.displayText}
                    </TableCell>
                    {/* Docentes */}
                    {ratings.map((rating, i) => {
                      const value = item.results?.docentes?.[rating];
                      return (
                        <TableCell 
                          key={`docentes-${rating}`} 
                          align="center"
                          sx={getCellStyle(value, rating, i === 2)}
                        >
                          {renderFrequencyValue(value)}
                        </TableCell>
                      );
                    })}
                    {/* Estudiantes */}
                    {ratings.map((rating, i) => {
                      const value = item.results?.estudiantes?.[rating];
                      return (
                        <TableCell 
                          key={`estudiantes-${rating}`} 
                          align="center"
                          sx={getCellStyle(value, rating, i === 2)}
                        >
                          {renderFrequencyValue(value)}
                        </TableCell>
                      );
                    })}
                    {/* Acudientes */}
                    {ratings.map((rating, i) => {
                      const value = item.results?.acudientes?.[rating];
                      return (
                        <TableCell 
                          key={`acudientes-${rating}`} 
                          align="center"
                          sx={getCellStyle(value, rating, i === 2)}
                        >
                          {renderFrequencyValue(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* Palmares - School Rankings Table */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 2, bgcolor: '#1E3A8A', color: 'white' }}>
          <Typography variant="h5" gutterBottom>
            PALMARES - RANKING DE INSTITUCIONES
          </Typography>
        </Paper>
        <Box sx={{ mt: 3 }}>
          <SchoolRankingTable />
        </Box>
      </Box>
    </Container>
  );
};