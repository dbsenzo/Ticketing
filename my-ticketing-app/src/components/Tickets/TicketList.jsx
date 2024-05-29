import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Heading, Tag, Badge } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/tickets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedTickets = response.data.sort((a, b) => {
        const priorityOrder = { 'High': 3, 'Mid': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      setTickets(sortedTickets);
    } catch (error) {
      console.error('Error fetching tickets', error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket', error);
    }
  };

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

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Tickets</Heading>
      <Button colorScheme="green" mb="4" onClick={() => navigate('/tickets/new')}>Create New Ticket</Button>
      <Table variant="simple">
        <Tbody>
          {tickets.map(ticket => (
            <Tr key={ticket._id}>
              <Td>{ticket.title}</Td>
              <Td>{ticket.description}</Td>
              <Td><Badge colorScheme={getBadgeColor(ticket.priority)}>{ticket.priority}</Badge></Td>
              <Td><Tag colorScheme={getTagColor(ticket.status)}>{ticket.status}</Tag></Td>
              <Td>
                <Button colorScheme="blue" mr="4" onClick={() => navigate(`/tickets/${ticket._id}`)}>View</Button>
                <Button colorScheme="red" onClick={() => handleDelete(ticket._id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TicketList;
