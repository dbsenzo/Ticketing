// src/components/Statistics/Statistics.jsx
import { useState, useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';

const Statistics = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/statistics')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching statistics', error));
  }, []);

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Statistics</Heading>
      <Text>Tickets per month: {stats.ticketsPerMonth}</Text>
      <Text>Tickets per user: {stats.ticketsPerUser}</Text>
      {/* Add more statistics as needed */}
    </Box>
  );
};

export default Statistics;
