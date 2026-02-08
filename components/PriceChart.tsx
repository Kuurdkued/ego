
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PricePoint } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface PriceChartProps {
  history: PricePoint[];
}

const PriceChart: React.FC<PriceChartProps> = ({ history }) => {
  const data = useMemo(() => ({
    labels: history.map(p => new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      {
        fill: true,
        label: 'EGO Price ($)',
        data: history.map(p => p.price),
        borderColor: '#FF007A',
        backgroundColor: 'rgba(255, 0, 122, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }), [history]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#121212',
        titleColor: '#FF007A',
        bodyColor: '#fff',
        borderColor: '#FF007A',
        borderWidth: 1,
      },
    },
    scales: {
      x: { 
        display: false,
        grid: { display: false }
      },
      y: {
        display: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#666', font: { size: 10 } }
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
