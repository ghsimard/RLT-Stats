import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface PDFGenerationSpinnerProps {
  message?: string;
}

const PDFGenerationSpinner: React.FC<PDFGenerationSpinnerProps> = ({ 
  message = 'Generando PDFs' 
}) => {
  const [dots, setDots] = useState('');

  // Animate the dots to show progress
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center',
        gap: 1
      }}
    >
      <CircularProgress size={16} color="inherit" />
      <Typography variant="body2" sx={{ fontSize: '0.875rem', minWidth: '100px' }}>
        {message}{dots}
      </Typography>
    </Box>
  );
};

export default PDFGenerationSpinner; 