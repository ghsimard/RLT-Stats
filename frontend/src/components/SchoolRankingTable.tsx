import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import { SchoolRanking, getSchoolRankings } from '../services/databaseService';

interface SchoolRankingTableProps {
  className?: string;
}

export const SchoolRankingTable: React.FC<SchoolRankingTableProps> = ({ className }) => {
  const [rankings, setRankings] = useState<SchoolRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const data = await getSchoolRankings();
        setRankings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el ranking de escuelas');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (rankings.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No hay datos disponibles para el ranking de escuelas.</Typography>
      </Box>
    );
  }

  const getScoreColor = (score: number): string => {
    if (score >= 3.5) return '#388e3c'; // Green
    if (score >= 3) return '#689f38'; // Light Green
    if (score >= 2.5) return '#ffa000'; // Amber
    if (score >= 2) return '#f57c00'; // Orange
    return '#d32f2f'; // Red
  };

  const getScoreChipColor = (score: number): 'success' | 'warning' | 'error' | 'default' => {
    if (score >= 3.5) return 'success'; // Green
    if (score >= 2.5) return 'warning'; // Warning/Yellow
    if (score >= 2) return 'default'; // Default/Gray
    return 'error'; // Red
  };

  return (
    <Box className={className}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Palmares - Ranking de Escuelas
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom align="center">
          Puntajes calculados según las respuestas: Siempre (4pts), Casi Siempre (3pts), A Veces (2pts), Casi Nunca (1pt), Nunca (0pts)
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#1E3A8A' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '70px' }}>Posición</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Institución Educativa</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '100px' }} align="center">Puntaje</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '100px' }} align="center">Porcentaje</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '100px' }} align="center">Respuestas</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '300px' }} align="center">Distribución</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankings.map((school) => (
              <TableRow 
                key={school.school} 
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                  '&:hover': { backgroundColor: '#e3f2fd' }
                }}
              >
                <TableCell align="center">
                  <Chip 
                    label={`#${school.rank}`} 
                    variant="filled"
                    color={school.rank <= 3 ? 'primary' : 'default'}
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      ...(school.rank === 1 && { backgroundColor: '#FFD700' }), // Gold
                      ...(school.rank === 2 && { backgroundColor: '#C0C0C0' }), // Silver
                      ...(school.rank === 3 && { backgroundColor: '#CD7F32' }), // Bronze
                    }}
                  />
                </TableCell>
                <TableCell>{school.school}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={school.averageScore.toFixed(2)} 
                    size="small" 
                    color={getScoreChipColor(school.averageScore)} 
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell align="center">{school.percentageScore}%</TableCell>
                <TableCell align="center">{school.totalResponses}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {/* Siempre */}
                    <Box 
                      sx={{ 
                        height: 16, 
                        bgcolor: '#388e3c',
                        flexGrow: school.ratings.siempre,
                        minWidth: school.ratings.siempre > 0 ? 5 : 0,
                        borderRadius: '2px 0 0 2px',
                        position: 'relative',
                        '&:hover::after': {
                          content: `"Siempre: ${school.ratings.siempre}"`,
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          zIndex: 1
                        }
                      }} 
                    />
                    
                    {/* Casi Siempre */}
                    <Box 
                      sx={{ 
                        height: 16, 
                        bgcolor: '#689f38',
                        flexGrow: school.ratings.casi_siempre,
                        minWidth: school.ratings.casi_siempre > 0 ? 5 : 0,
                        position: 'relative',
                        '&:hover::after': {
                          content: `"Casi Siempre: ${school.ratings.casi_siempre}"`,
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          zIndex: 1
                        }
                      }} 
                    />
                    
                    {/* A Veces */}
                    <Box 
                      sx={{ 
                        height: 16, 
                        bgcolor: '#ffa000',
                        flexGrow: school.ratings.a_veces,
                        minWidth: school.ratings.a_veces > 0 ? 5 : 0,
                        position: 'relative',
                        '&:hover::after': {
                          content: `"A Veces: ${school.ratings.a_veces}"`,
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          zIndex: 1
                        }
                      }} 
                    />
                    
                    {/* Casi Nunca */}
                    <Box 
                      sx={{ 
                        height: 16, 
                        bgcolor: '#f57c00',
                        flexGrow: school.ratings.casi_nunca,
                        minWidth: school.ratings.casi_nunca > 0 ? 5 : 0,
                        position: 'relative',
                        '&:hover::after': {
                          content: `"Casi Nunca: ${school.ratings.casi_nunca}"`,
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          zIndex: 1
                        }
                      }} 
                    />
                    
                    {/* Nunca */}
                    <Box 
                      sx={{ 
                        height: 16, 
                        bgcolor: '#d32f2f',
                        flexGrow: school.ratings.nunca,
                        minWidth: school.ratings.nunca > 0 ? 5 : 0,
                        borderRadius: '0 2px 2px 0',
                        position: 'relative',
                        '&:hover::after': {
                          content: `"Nunca: ${school.ratings.nunca}"`,
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          zIndex: 1
                        }
                      }} 
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 