import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  horizontal = true
}) => {
  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}`;
          }
        }
      },
      datalabels: {
        display: true,
        color: (context) => {
          // For horizontal bar charts with dark colors, use white text
          if (horizontal) {
            return '#FFFFFF';
          }
          // Otherwise use dark text color
          return '#333333';
        },
        anchor: horizontal ? 'center' : 'end',
        align: horizontal ? 'center' : 'top',
        font: {
          weight: 'bold'
        },
        formatter: (value: number, context: any) => {
          if (value <= 0) return '';
          
          // Calculate percentage
          const total = context.chart.data.datasets[0].data.reduce(
            (sum: number, val: number) => sum + val, 
            0
          );
          const percentage = Math.round((value / total) * 100);
          
          return `${value} (${percentage}%)`;
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 300 }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
}; 