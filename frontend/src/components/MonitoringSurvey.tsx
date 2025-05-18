/**
 * MonitoringSurvey Component
 * 
 * This component displays a monitoring dashboard for school surveys, showing:
 * - Total response counts for teachers, students, and parents
 * - Individual school response statistics
 * - Contact information for each school
 * - Grade distribution visualization for selected schools
 */

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { GradesPieChart } from './GradesPieChart';
import { config } from '../config';

/**
 * Legend Component
 * Displays the color-coded legend explaining the response count categories:
 * - Red (0): No responses
 * - Yellow (1-24): Insufficient responses
 * - Green (25+): Sufficient responses
 */

interface LegendProps {
  schools: SchoolMonitoringData[];
}

const Legend: React.FC<LegendProps> = ({ schools }) => {
  // Calculate counts for each category
  const counts = schools.reduce((acc, school) => {
    const totalSubmissions = 
      school.submissions.docentes + 
      school.submissions.estudiantes + 
      school.submissions.acudientes;
    
    if (totalSubmissions === 0) {
      acc.noResponses++;
    } else if (totalSubmissions >= 1 && totalSubmissions <= 24) {
      acc.insufficient++;
    } else {
      acc.sufficient++;
    }
    return acc;
  }, { noResponses: 0, insufficient: 0, sufficient: 0 });

  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <Typography variant="subtitle1" sx={{ mr: 1 }}>Leyenda:</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip label="0" color="error" size="small" />
        <Typography variant="body2">Sin respuestas ({counts.noResponses} escuelas)</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip label="1-24" color="warning" size="small" />
        <Typography variant="body2">Respuestas insuficientes ({counts.insufficient} escuelas)</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip label="25+" color="success" size="small" />
        <Typography variant="body2">Respuestas suficientes ({counts.sufficient} escuelas)</Typography>
      </Box>
    </Box>
  );
};

/**
 * Interface defining the structure of school monitoring data
 * Contains school information, contact details, and survey submission counts
 */

const API_BASE_URL = config.api.baseUrl;

interface SchoolMonitoringData {
  schoolName: string;
  rectorName: string;
  currentPosition: string;
  personalEmail: string;
  institutionalEmail: string;
  personalPhone: string;
  institutionalPhone: string;
  preferredContact: string;
  submissions: {
    docentes: number;
    estudiantes: number;
    acudientes: number;
  };
  meetingRequirements: boolean;
}

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  school: SchoolMonitoringData;
}

/**
 * ContactDialog Component
 * Displays detailed contact information for a selected school
 * Shows both personal and institutional contact details with visual indication
 * of the preferred contact method
 */

const ContactDialog: React.FC<ContactDialogProps> = ({ open, onClose, school }) => {
  const isPersonalPreferred = school.preferredContact?.toLowerCase().includes('personal');
  const isInstitutionalPreferred = school.preferredContact?.toLowerCase().includes('institucional');

  console.log('ContactDialog - school data:', school);
  console.log('ContactDialog - currentPosition:', school.currentPosition);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Información de Contacto</DialogTitle>
      <DialogContent>
        <Box py={2}>
          <Typography variant="h6" gutterBottom>{school.schoolName}</Typography>
          <Typography variant="subtitle1" gutterBottom>
            {school.rectorName}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {school.currentPosition || 'Cargo no especificado'}
          </Typography>

          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            {/* Personal Contact Information */}
            <Box sx={{ 
              p: 2, 
              bgcolor: isPersonalPreferred ? '#e3f2fd' : 'transparent',
              borderRadius: 1
            }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contacto Personal
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body1">
                  <EmailIcon sx={{ mr: 1 }} />
                  {school.personalEmail}
                </Typography>
                <Typography variant="body1">
                  <PhoneIcon sx={{ mr: 1 }} />
                  {school.personalPhone}
                </Typography>
              </Box>
            </Box>

            {/* Institutional Contact Information */}
            <Box sx={{ 
              p: 2, 
              bgcolor: isInstitutionalPreferred ? '#e3f2fd' : 'transparent',
              borderRadius: 1
            }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contacto Institucional
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body1">
                  <EmailIcon sx={{ mr: 1 }} />
                  {school.institutionalEmail}
                </Typography>
                <Typography variant="body1">
                  <PhoneIcon sx={{ mr: 1 }} />
                  {school.institutionalPhone}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />
            
            <Typography variant="body1">
              <ContactPhoneIcon sx={{ mr: 1 }} />
              Contacto preferido: {school.preferredContact}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Main MonitoringSurvey Component
 * 
 * Features:
 * - Fetches and displays school survey data
 * - Shows total response counts
 * - Provides interactive table with school details
 * - Includes contact information dialog
 * - Displays grade distribution charts
 */

export const MonitoringSurvey: React.FC = () => {
  const [schools, setSchools] = useState<SchoolMonitoringData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolMonitoringData | null>(null);

  // Calculate totals
  const totals = schools.reduce((acc, school) => ({
    docentes: acc.docentes + school.submissions.docentes,
    estudiantes: acc.estudiantes + school.submissions.estudiantes,
    acudientes: acc.acudientes + school.submissions.acudientes
  }), { docentes: 0, estudiantes: 0, acudientes: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/monitoring`);
        if (!response.ok) throw new Error('Error al cargar los datos');
        const data = await response.json();
        console.log('API Response:', data);
        console.log('First school currentPosition:', data[0]?.currentPosition);
        
        // Ensure unique schools by using a Map with schoolName as key
        const uniqueSchoolsMap = new Map<string, SchoolMonitoringData>();
        
        // Only keep the most recent entry for each school name
        data.forEach((school: SchoolMonitoringData) => {
          uniqueSchoolsMap.set(school.schoolName, school);
        });
        
        // Convert the Map back to an array and sort alphabetically
        const uniqueSchools = Array.from(uniqueSchoolsMap.values()).sort((a, b) => 
          a.schoolName.localeCompare(b.schoolName)
        );
        
        console.log(`Filtered ${data.length} schools to ${uniqueSchools.length} unique schools`);
        setSchools(uniqueSchools);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContactClick = (school: SchoolMonitoringData) => {
    setSelectedSchool(school);
  };

  const handleCloseDialog = () => {
    setSelectedSchool(null);
  };

  /**
   * Returns a color-coded chip based on the number of submissions
   * @param count - Number of submissions
   * @returns Chip component with appropriate color and label
   */
  const getSubmissionStatus = (count: number) => {
    if (count === 0) {
      return <Chip label={count} color="error" />;
    } else if (count >= 1 && count <= 24) {
      return <Chip label={count} color="warning" />;
    } else {
      return <Chip label={count} color="success" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="monitoring-survey">
      <header className="bg-white shadow">
        <Container maxWidth="lg">
          <Box py={4}>
            <Typography variant="h3" component="h1" gutterBottom>
              Monitoreo de Encuestas
            </Typography>
          </Box>
        </Container>
      </header>

      <Container maxWidth="lg">
        <Box py={4}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Summary Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen Total de Respuestas
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">Docentes</Typography>
                <Typography variant="h4">{totals.docentes}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">Estudiantes</Typography>
                <Typography variant="h4">{totals.estudiantes}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">Acudientes</Typography>
                <Typography variant="h4">{totals.acudientes}</Typography>
              </Box>
            </Box>
          </Paper>
          
          <Legend schools={schools} />
          
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Institución Educativa</TableCell>
                  <TableCell align="center">Docentes</TableCell>
                  <TableCell align="center">Estudiantes</TableCell>
                  <TableCell align="center">Acudientes</TableCell>
                  <TableCell align="center">Contacto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.schoolName}>
                    <TableCell component="th" scope="row">
                      {school.schoolName}
                    </TableCell>
                    <TableCell align="center">
                      {getSubmissionStatus(school.submissions.docentes)}
                    </TableCell>
                    <TableCell align="center">
                      {getSubmissionStatus(school.submissions.estudiantes)}
                    </TableCell>
                    <TableCell align="center">
                      {getSubmissionStatus(school.submissions.acudientes)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver información de contacto">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleContactClick(school)}
                        >
                          <ContactPhoneIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add GradesPieChart for selected school */}
          {selectedSchool && (
            <Box mt={4}>
              <Paper elevation={3}>
                <Box p={3}>
                  <Typography variant="h6" gutterBottom>
                    Distribución de Grados - {selectedSchool.schoolName}
                  </Typography>
                  <GradesPieChart school={selectedSchool.schoolName} type="estudiantes" />
                </Box>
              </Paper>
            </Box>
          )}

          {selectedSchool && (
            <ContactDialog
              open={!!selectedSchool}
              onClose={handleCloseDialog}
              school={selectedSchool}
            />
          )}
        </Box>
      </Container>
    </div>
  );
}; 