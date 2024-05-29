import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Badge, Tag } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTicket(response.data);
      } catch (error) {
        console.error('Error fetching ticket', error);
      }
    };

    fetchTicket();
  }, [id]);

  const getBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Mid':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getTagColor = (status) => {
    switch (status) {
      case 'Open':
        return 'blue';
      case 'In Progress':
        return 'yellow';
      case 'Closed':
        return 'green';
      default:
        return 'gray';
    }
  };

  if (!ticket) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="white" mb="4">{ticket.title}</Heading>
      <Text color="white" mb="4">{ticket.description}</Text>
      <Box display={'flex'} flexDirection={'column'} width={'fit-content'} gap={'8px'}>
        <Badge colorScheme={getBadgeColor(ticket.priority)}>{ticket.priority}</Badge>
        <Tag colorScheme={getTagColor(ticket.status)}>{ticket.status}</Tag>
      </Box>
      <Button colorScheme="blue" mr="4" onClick={() => navigate(`/tickets/${ticket._id}/edit`)}>Edit</Button>
      <Button colorScheme="red" onClick={() => navigate('/tickets')}>Back</Button>
    </Box>
  );
};

export default TicketDetail;
