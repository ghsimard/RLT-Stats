import React from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BarChartData } from './BarChart';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface PieChartProps {
  data: BarChartData[];
  title: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <Box>
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Typography align="center">No hay datos disponibles</Typography>
      </Box>
    );
  }

  const chartData = {
    labels: data.map(item => {
      const total = data.reduce((sum, d) => sum + d.value, 0);
      const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
      return `${item.label}: ${item.value} (${percentage}%)`;
    }),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 15,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const backgroundColors = dataset.backgroundColor as string[];
                const backgroundColor = backgroundColors?.[i] || '#000';
                return {
                  text: label as string,
                  fillStyle: backgroundColor,
                  strokeStyle: backgroundColor,
                  lineWidth: 0,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        display: true,
        color: '#FFFFFF',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return percentage >= 5 ? `${percentage}%` : '';
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ 
        height: 350, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Pie data={chartData} options={options} />
      </Box>
    </Box>
  );
}; 