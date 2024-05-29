import { useState, useEffect } from 'react';
import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaDollarSign, FaProductHunt, FaChartBar } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        backgroundColor: 'rgba(100, 0, 100, 1)',
        borderColor: 'rgba(100, 0, 100, 1)',
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
        backgroundColor: 'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
        backgroundColor: 'rgba(0, 206, 86, 1)',
        borderColor: 'rgba(0, 206, 86, 1)',
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
        backgroundColor: 'rgba(100, 0, 100, 1)',
        borderColor: 'rgba(100, 0, 100, 1)',
        borderWidth: 1,
      },
    ],
  };

  const avgResolutionTimeInMinutes = (stats.avgResolutionTime / 60000).toFixed(2);

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Statistics</Heading>
      <SimpleGrid columns={[1, null, 2]} spacing="8">
        <Box mb="8" p="4" bgGradient="linear-gradient(116deg, rgba(232, 232, 232, 0.03) 0%, rgba(232, 232, 232, 0.03) 10%,rgba(14, 14, 14, 0.03) 10%, rgba(14, 14, 14, 0.03) 66%,rgba(232, 232, 232, 0.03) 66%, rgba(232, 232, 232, 0.03) 72%,rgba(44, 44, 44, 0.03) 72%, rgba(44, 44, 44, 0.03) 81%,rgba(51, 51, 51, 0.03) 81%, rgba(51, 51, 51, 0.03) 100%),linear-gradient(109deg, rgba(155, 155, 155, 0.03) 0%, rgba(155, 155, 155, 0.03) 23%,rgba(30, 30, 30, 0.03) 23%, rgba(30, 30, 30, 0.03) 63%,rgba(124, 124, 124, 0.03) 63%, rgba(124, 124, 124, 0.03) 73%,rgba(195, 195, 195, 0.03) 73%, rgba(195, 195, 195, 0.03) 84%,rgba(187, 187, 187, 0.03) 84%, rgba(187, 187, 187, 0.03) 100%),linear-gradient(79deg, rgba(254, 254, 254, 0.03) 0%, rgba(254, 254, 254, 0.03) 27%,rgba(180, 180, 180, 0.03) 27%, rgba(180, 180, 180, 0.03) 33%,rgba(167, 167, 167, 0.03) 33%, rgba(167, 167, 167, 0.03) 34%,rgba(68, 68, 68, 0.03) 34%, rgba(68, 68, 68, 0.03) 63%,rgba(171, 171, 171, 0.03) 63%, rgba(171, 171, 171, 0.03) 100%),linear-gradient(109deg, rgba(71, 71, 71, 0.03) 0%, rgba(71, 71, 71, 0.03) 3%,rgba(97, 97, 97, 0.03) 3%, rgba(97, 97, 97, 0.03) 40%,rgba(40, 40, 40, 0.03) 40%, rgba(40, 40, 40, 0.03) 55%,rgba(5, 5, 5, 0.03) 55%, rgba(5, 5, 5, 0.03) 73%,rgba(242, 242, 242, 0.03) 73%, rgba(242, 242, 242, 0.03) 100%),linear-gradient(271deg, rgba(70, 70, 70, 0.03) 0%, rgba(70, 70, 70, 0.03) 11%,rgba(178, 178, 178, 0.03) 11%, rgba(178, 178, 178, 0.03) 23%,rgba(28, 28, 28, 0.03) 23%, rgba(28, 28, 28, 0.03) 72%,rgba(152, 152, 152, 0.03) 72%, rgba(152, 152, 152, 0.03) 86%,rgba(43, 43, 43, 0.03) 86%, rgba(43, 43, 43, 0.03) 100%),linear-gradient(90deg, rgb(27, 27, 27),rgb(1, 1, 1));" shadow="md" borderRadius="lg">
          <Flex alignItems="center" mb="4">
            <FaDollarSign size={24} color="white" />
            <Text ml="2" fontSize="lg" color="white">Tickets per Month</Text>
          </Flex>
          <Bar data={ticketsPerMonthData} options={{ responsive: true }} />
        </Box>
        <Box mb="8" p="4" bgGradient="linear-gradient(306deg, rgba(54, 54, 54, 0.05) 0%, rgba(54, 54, 54, 0.05) 33.333%,rgba(85, 85, 85, 0.05) 33.333%, rgba(85, 85, 85, 0.05) 66.666%,rgba(255, 255, 255, 0.05) 66.666%, rgba(255, 255, 255, 0.05) 99.999%),linear-gradient(353deg, rgba(81, 81, 81, 0.05) 0%, rgba(81, 81, 81, 0.05) 33.333%,rgba(238, 238, 238, 0.05) 33.333%, rgba(238, 238, 238, 0.05) 66.666%,rgba(32, 32, 32, 0.05) 66.666%, rgba(32, 32, 32, 0.05) 99.999%),linear-gradient(140deg, rgba(192, 192, 192, 0.05) 0%, rgba(192, 192, 192, 0.05) 33.333%,rgba(109, 109, 109, 0.05) 33.333%, rgba(109, 109, 109, 0.05) 66.666%,rgba(30, 30, 30, 0.05) 66.666%, rgba(30, 30, 30, 0.05) 99.999%),linear-gradient(189deg, rgba(77, 77, 77, 0.05) 0%, rgba(77, 77, 77, 0.05) 33.333%,rgba(55, 55, 55, 0.05) 33.333%, rgba(55, 55, 55, 0.05) 66.666%,rgba(145, 145, 145, 0.05) 66.666%, rgba(145, 145, 145, 0.05) 99.999%),linear-gradient(90deg, rgb(9, 201, 186),rgb(18, 131, 221));" shadow="md" borderRadius="lg">
          <Flex alignItems="center" mb="4">
            <FaChartBar size={24} color="white" />
            <Text ml="2" fontSize="lg" color="white">Tickets per User</Text>
          </Flex>
          <Bar data={ticketsPerUserData} options={{ responsive: true }} />
        </Box>
        <Box mb="8" p="4" bgGradient="linear-gradient(56deg, rgba(254, 254, 254, 0.05) 0%, rgba(254, 254, 254, 0.05) 69%,rgba(160, 160, 160, 0.05) 69%, rgba(160, 160, 160, 0.05) 100%),linear-gradient(194deg, rgba(102, 102, 102, 0.02) 0%, rgba(102, 102, 102, 0.02) 60%,rgba(67, 67, 67, 0.02) 60%, rgba(67, 67, 67, 0.02) 100%),linear-gradient(76deg, rgba(169, 169, 169, 0.06) 0%, rgba(169, 169, 169, 0.06) 89%,rgba(189, 189, 189, 0.06) 89%, rgba(189, 189, 189, 0.06) 100%),linear-gradient(326deg, rgba(213, 213, 213, 0.04) 0%, rgba(213, 213, 213, 0.04) 45%,rgba(66, 66, 66, 0.04) 45%, rgba(66, 66, 66, 0.04) 100%),linear-gradient(183deg, rgba(223, 223, 223, 0.01) 0%, rgba(223, 223, 223, 0.01) 82%,rgba(28, 28, 28, 0.01) 82%, rgba(28, 28, 28, 0.01) 100%),linear-gradient(3deg, rgba(20, 20, 20, 0.06) 0%, rgba(20, 20, 20, 0.06) 62%,rgba(136, 136, 136, 0.06) 62%, rgba(136, 136, 136, 0.06) 100%),linear-gradient(200deg, rgba(206, 206, 206, 0.09) 0%, rgba(206, 206, 206, 0.09) 58%,rgba(6, 6, 6, 0.09) 58%, rgba(6, 6, 6, 0.09) 100%),linear-gradient(304deg, rgba(162, 162, 162, 0.07) 0%, rgba(162, 162, 162, 0.07) 27%,rgba(24, 24, 24, 0.07) 27%, rgba(24, 24, 24, 0.07) 100%),linear-gradient(186deg, rgba(166, 166, 166, 0.04) 0%, rgba(166, 166, 166, 0.04) 5%,rgba(210, 210, 210, 0.04) 5%, rgba(210, 210, 210, 0.04) 100%),linear-gradient(90deg, rgb(26, 118, 64),rgb(32, 207, 121),rgb(78, 196, 128));" shadow="md" borderRadius="lg">
          <Flex alignItems="center" mb="4">
            <FaProductHunt size={24} color="white" />
            <Text ml="2" fontSize="lg" color="white">Tickets per Project</Text>
          </Flex>
          <Bar data={ticketsPerProjectData} options={{ responsive: true }} />
        </Box>
        <Box mb="8" p="4" bgGradient=" linear-gradient(161deg, rgba(121, 121, 121, 0.02) 0%, rgba(121, 121, 121, 0.02) 16.667%,rgba(193, 193, 193, 0.02) 16.667%, rgba(193, 193, 193, 0.02) 33.334%,rgba(177, 177, 177, 0.02) 33.334%, rgba(177, 177, 177, 0.02) 50.001000000000005%,rgba(5, 5, 5, 0.02) 50.001%, rgba(5, 5, 5, 0.02) 66.668%,rgba(229, 229, 229, 0.02) 66.668%, rgba(229, 229, 229, 0.02) 83.33500000000001%,rgba(211, 211, 211, 0.02) 83.335%, rgba(211, 211, 211, 0.02) 100.002%),linear-gradient(45deg, rgba(223, 223, 223, 0.02) 0%, rgba(223, 223, 223, 0.02) 14.286%,rgba(70, 70, 70, 0.02) 14.286%, rgba(70, 70, 70, 0.02) 28.572%,rgba(109, 109, 109, 0.02) 28.572%, rgba(109, 109, 109, 0.02) 42.858%,rgba(19, 19, 19, 0.02) 42.858%, rgba(19, 19, 19, 0.02) 57.144%,rgba(180, 180, 180, 0.02) 57.144%, rgba(180, 180, 180, 0.02) 71.42999999999999%,rgba(63, 63, 63, 0.02) 71.43%, rgba(63, 63, 63, 0.02) 85.71600000000001%,rgba(87, 87, 87, 0.02) 85.716%, rgba(87, 87, 87, 0.02) 100.002%),linear-gradient(337deg, rgba(142, 142, 142, 0.02) 0%, rgba(142, 142, 142, 0.02) 20%,rgba(164, 164, 164, 0.02) 20%, rgba(164, 164, 164, 0.02) 40%,rgba(203, 203, 203, 0.02) 40%, rgba(203, 203, 203, 0.02) 60%,rgba(228, 228, 228, 0.02) 60%, rgba(228, 228, 228, 0.02) 80%,rgba(54, 54, 54, 0.02) 80%, rgba(54, 54, 54, 0.02) 100%),linear-gradient(314deg, rgba(187, 187, 187, 0.02) 0%, rgba(187, 187, 187, 0.02) 12.5%,rgba(170, 170, 170, 0.02) 12.5%, rgba(170, 170, 170, 0.02) 25%,rgba(214, 214, 214, 0.02) 25%, rgba(214, 214, 214, 0.02) 37.5%,rgba(187, 187, 187, 0.02) 37.5%, rgba(187, 187, 187, 0.02) 50%,rgba(190, 190, 190, 0.02) 50%, rgba(190, 190, 190, 0.02) 62.5%,rgba(6, 6, 6, 0.02) 62.5%, rgba(6, 6, 6, 0.02) 75%,rgba(206, 206, 206, 0.02) 75%, rgba(206, 206, 206, 0.02) 87.5%,rgba(171, 171, 171, 0.02) 87.5%, rgba(171, 171, 171, 0.02) 100%),linear-gradient(300deg, rgba(243, 243, 243, 0.01) 0%, rgba(243, 243, 243, 0.01) 12.5%,rgba(209, 209, 209, 0.01) 12.5%, rgba(209, 209, 209, 0.01) 25%,rgba(179, 179, 179, 0.01) 25%, rgba(179, 179, 179, 0.01) 37.5%,rgba(3, 3, 3, 0.01) 37.5%, rgba(3, 3, 3, 0.01) 50%,rgba(211, 211, 211, 0.01) 50%, rgba(211, 211, 211, 0.01) 62.5%,rgba(151, 151, 151, 0.01) 62.5%, rgba(151, 151, 151, 0.01) 75%,rgba(16, 16, 16, 0.01) 75%, rgba(16, 16, 16, 0.01) 87.5%,rgba(242, 242, 242, 0.01) 87.5%, rgba(242, 242, 242, 0.01) 100%),linear-gradient(6deg, rgba(31, 31, 31, 0.02) 0%, rgba(31, 31, 31, 0.02) 20%,rgba(193, 193, 193, 0.02) 20%, rgba(193, 193, 193, 0.02) 40%,rgba(139, 139, 139, 0.02) 40%, rgba(139, 139, 139, 0.02) 60%,rgba(14, 14, 14, 0.02) 60%, rgba(14, 14, 14, 0.02) 80%,rgba(122, 122, 122, 0.02) 80%, rgba(122, 122, 122, 0.02) 100%),linear-gradient(279deg, rgba(190, 190, 190, 0.02) 0%, rgba(190, 190, 190, 0.02) 14.286%,rgba(160, 160, 160, 0.02) 14.286%, rgba(160, 160, 160, 0.02) 28.572%,rgba(23, 23, 23, 0.02) 28.572%, rgba(23, 23, 23, 0.02) 42.858%,rgba(60, 60, 60, 0.02) 42.858%, rgba(60, 60, 60, 0.02) 57.144%,rgba(149, 149, 149, 0.02) 57.144%, rgba(149, 149, 149, 0.02) 71.42999999999999%,rgba(4, 4, 4, 0.02) 71.43%, rgba(4, 4, 4, 0.02) 85.71600000000001%,rgba(50, 50, 50, 0.02) 85.716%, rgba(50, 50, 50, 0.02) 100.002%),linear-gradient(109deg, rgba(124, 124, 124, 0.03) 0%, rgba(124, 124, 124, 0.03) 12.5%,rgba(61, 61, 61, 0.03) 12.5%, rgba(61, 61, 61, 0.03) 25%,rgba(187, 187, 187, 0.03) 25%, rgba(187, 187, 187, 0.03) 37.5%,rgba(207, 207, 207, 0.03) 37.5%, rgba(207, 207, 207, 0.03) 50%,rgba(206, 206, 206, 0.03) 50%, rgba(206, 206, 206, 0.03) 62.5%,rgba(118, 118, 118, 0.03) 62.5%, rgba(118, 118, 118, 0.03) 75%,rgba(89, 89, 89, 0.03) 75%, rgba(89, 89, 89, 0.03) 87.5%,rgba(96, 96, 96, 0.03) 87.5%, rgba(96, 96, 96, 0.03) 100%),linear-gradient(329deg, rgba(35, 35, 35, 0.02) 0%, rgba(35, 35, 35, 0.02) 20%,rgba(246, 246, 246, 0.02) 20%, rgba(246, 246, 246, 0.02) 40%,rgba(118, 118, 118, 0.02) 40%, rgba(118, 118, 118, 0.02) 60%,rgba(245, 245, 245, 0.02) 60%, rgba(245, 245, 245, 0.02) 80%,rgba(140, 140, 140, 0.02) 80%, rgba(140, 140, 140, 0.02) 100%),linear-gradient(90deg, hsl(314,0%,31%),hsl(314,0%,31%));" shadow="md" borderRadius="lg">
          <Flex alignItems="center" mb="4">
            <FaChartBar size={24} color="white" />
            <Text ml="2" fontSize="lg" color="white">Tickets per Status</Text>
          </Flex>
          <Bar data={ticketsPerStatusData} options={{ responsive: true }} />
        </Box>
        <Box mb="8" p="4" bgGradient="repeating-linear-gradient(135deg, rgb(0,0,0) 0px, rgb(0,0,0) 10px,transparent 10px, transparent 11px),repeating-linear-gradient(22.5deg, rgb(0,0,0) 0px, rgb(0,0,0) 10px,transparent 10px, transparent 11px),linear-gradient(90deg, hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%));" shadow="md" borderRadius="lg">
          <Stat>
            <StatLabel color="white">Average Resolution Time (minutes)</StatLabel>
            <StatNumber color="white">{avgResolutionTimeInMinutes}</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Statistics;
