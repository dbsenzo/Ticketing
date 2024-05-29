import { useState, useEffect } from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Statistics = () => {
  const [stats, setStats] = useState({
    ticketsPerMonth: [],
    ticketsPerUser: [],
    ticketsPerProject: [],
    ticketsPerStatus: [],
    avgResolutionTime: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/statistics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics', error);
      }
    };

    fetchStatistics();
  }, []);

  const ticketsPerMonthData = {
    labels: stats.ticketsPerMonth.map(item => `Month ${item._id}`),
    datasets: [
      {
        label: 'Tickets per Month',
        data: stats.ticketsPerMonth.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ticketsPerUserData = {
    labels: stats.ticketsPerUser.map(item => item.user[0]?.username || 'Unassigned'),
    datasets: [
      {
        label: 'Tickets per User',
        data: stats.ticketsPerUser.map(item => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ticketsPerProjectData = {
    labels: stats.ticketsPerProject.map(item => item.project[0]?.name || 'Unknown'),
    datasets: [
      {
        label: 'Tickets per Project',
        data: stats.ticketsPerProject.map(item => item.count),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ticketsPerStatusData = {
    labels: stats.ticketsPerStatus.map(item => item._id),
    datasets: [
      {
        label: 'Tickets per Status',
        data: stats.ticketsPerStatus.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const avgResolutionTimeInMinutes = (stats.avgResolutionTime / 60000).toFixed(2);

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Statistics</Heading>
      <SimpleGrid columns={[1, null, 2]} spacing="8">
        <Box mb="8">
          <Text mb="4">Tickets per Month:</Text>
          <Bar data={ticketsPerMonthData} options={{ responsive: true }} />
        </Box>
        <Box mb="8">
          <Text mb="4">Tickets per User:</Text>
          <Pie data={ticketsPerUserData} options={{ responsive: true }} />
        </Box>
        <Box mb="8">
          <Text mb="4">Tickets per Project:</Text>
          <Bar data={ticketsPerProjectData} options={{ responsive: true }} />
        </Box>
        <Box mb="8">
          <Text mb="4">Tickets per Status:</Text>
          <Pie data={ticketsPerStatusData} options={{ responsive: true }} />
        </Box>
        <Box mb="8">
          <Text mb="4">Average Resolution Time (minutes): {avgResolutionTimeInMinutes}</Text>
        </Box>
      </SimpleGrid>
      {/* Add more statistics as needed */}
    </Box>
  );
};

export default Statistics;
