// src/components/Tickets/TicketDetail.jsx
import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/tickets/${id}`)
      .then(response => setTicket(response.data))
      .catch(error => console.error('Error fetching ticket', error));
  }, [id]);

  if (!ticket) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="white" mb="4">{ticket.title}</Heading>
      <Text color="white" mb="4">{ticket.description}</Text>
      <Button colorScheme="blue" mr="4">Edit</Button>
      <Button colorScheme="red">Delete</Button>
    </Box>
  );
};

export default TicketDetail;
