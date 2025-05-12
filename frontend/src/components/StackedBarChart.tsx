import React from 'react';
import { Box } from '@mui/material';

interface StackedBarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Box>No hay datos disponibles</Box>;
  }

  // Calculate total for percentages
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  // Sort the data to match the natural order of grades
  const gradeOrder: Record<string, number> = {
    'Preescolar': 0,
    'Primera infancia': 1
  };
  
  // Add numeric grades
  for (let i = 1; i <= 12; i++) {
    gradeOrder[`${i}°`] = i + 1;
  }
  
  // Update color scheme to use green, blue, red
  const getSegmentColor = (label: string) => {
    // Map the responses to the requested color scheme
    if (label === 'Siempre' || label === 'Casi Siempre') {
      return '#009900'; // Soothing green
    } else if (label === 'A Veces') {
      return '#4472C4'; // Blue instead of yellow
    } else if (label === 'Casi Nunca' || label === 'Nunca') {
      return '#FF0000'; // Standard red
    }
    
    // If not one of the standard labels, use the original distinct colors for grades
    return distinctColors[label] || '#CCCCCC';
  };
  
  // Define a visually distinct color palette for the grades
  const distinctColors: Record<string, string> = {
    'Preescolar': '#4472C4',     // Blue
    'Primera infancia': '#4472C4', // Blue
    '1°': '#ED7D31',             // Orange
    '2°': '#A5A5A5',             // Gray
    '3°': '#FFC000',             // Yellow
    '4°': '#5B9BD5',             // Light Blue
    '5°': '#70AD47',             // Green
    '6°': '#7030A0',             // Purple
    '7°': '#C00000',             // Red
    '8°': '#002060',             // Dark Blue
    '9°': '#974706',             // Brown
    '10°': '#92D050',            // Light Green
    '11°': '#FF6699'             // Pink
  };
  
  const sortedData = [...data].sort((a, b) => {
    const orderA = gradeOrder[a.label] !== undefined ? gradeOrder[a.label] : 999;
    const orderB = gradeOrder[b.label] !== undefined ? gradeOrder[b.label] : 999;
    return orderA - orderB;
  }).map(item => ({
    ...item,
    // Apply the new color scheme
    color: getSegmentColor(item.label)
  }));

  // Determine text color - all segments use white text now
  const textColor = 'white';

  return (
    <Box sx={{ 
      padding: 2,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      {/* Stacked Bar */}
      <Box sx={{ 
        width: '90%', // Changed from 100% to 80% to reduce overall width
        height: '40px',  // Increased height from 30px to 40px
        display: 'flex',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid #ccc', // Add border for better visibility
        marginBottom: 3,  // Added margin to make room for external labels
        marginLeft: 'auto', // Center the bar by using auto margins
        marginRight: 'auto'
      }}>
        {sortedData.map((item, index) => {
          const percentage = (item.value / totalValue) * 100;
          // Ensure small values still have a minimum visible width
          const minWidth = item.value > 0 ? Math.max(6, percentage * 0.85) : 0;  // Increased minimum width from 5px to 6px
          const widthPercentage = `${minWidth}px`;
          const showPercentage = percentage >= 8;  // Changed from 10% to 6%
          
          return (
            <Box 
              key={index}
              sx={{
                height: '100%',
                bgcolor: item.color,
                flexGrow: percentage >= 8 ? percentage : 0,  // Use consistent 8% threshold
                width: percentage < 8 ? widthPercentage : 'auto',
                minWidth: minWidth,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {showPercentage && (
                <Box sx={{ 
                  color: textColor, // White text for all backgrounds
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '0px 2px',
                  textShadow: '0px 0px 2px rgba(0,0,0,0.7)' // Add text shadow for better readability
                }}>
                  {Math.round(percentage)}%
                </Box>
              )}
              
              {/* External label with diagonal line for small segments */}
              {(percentage > 0 && percentage < 8) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: index % 2 === 0 ? '-30px' : '100%',  // Use fixed pixel values for more reliable positioning
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    zIndex: 10, // Ensure labels are above other elements
                  }}
                >
                  {/* Diagonal line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '2px', // Increased width for better visibility
                      height: '15px', // Increased height for better visibility
                      bgcolor: item.color, // Use the same color as the segment
                      top: index % 2 === 0 ? '100%' : '0',
                      left: '0',
                      transform: index % 2 === 0 ? 'rotate(45deg) translateY(-5px)' : 'rotate(-45deg) translateY(5px)',
                      transformOrigin: index % 2 === 0 ? 'bottom' : 'top',
                    }}
                  />
                  {/* Label */}
                  <Box
                    sx={{
                      fontSize: '10px', // Increased font size for better visibility
                      fontWeight: 'bold',
                      color: item.color, // Use the segment color for text
                      position: 'absolute',
                      top: index % 2 === 0 ? '-15px' : '15px',
                      left: '-10px',
                      whiteSpace: 'nowrap',
                      textShadow: '0px 0px 3px rgba(255,255,255,1)',
                      backgroundColor: 'rgba(255,255,255,0.7)', // Add semi-transparent background for better readability
                      padding: '1px 3px',
                      borderRadius: '2px',
                    }}
                  >
                    {Math.round(percentage)}%
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      
      {/* Legend */}
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        marginTop: 2
      }}>
        {sortedData.map((item, index) => {
          const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0';
          return (
            <Box 
              key={index}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: item.color,
                  borderRadius: '2px',
                  border: '1px solid rgba(0,0,0,0.2)' // Add border for better visibility
                }} 
              />
              <Box sx={{ fontSize: '12px' }}>
                {item.label} ({item.value}) - {percentage}%
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}; 