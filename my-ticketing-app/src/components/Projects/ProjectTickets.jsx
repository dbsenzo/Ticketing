import { useState, useEffect } from 'react';
import { Box, Button, Heading, SimpleGrid } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TicketCard from '../Tickets/TicketCard';

const ProjectTickets = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/projects/${id}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, [id]);

  const handleDelete = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket', error);
    }
  };

  return (
    <Box p="8" w={'100%'}>
      <Heading as="h2" size="xl" mb="4">Tickets for Project</Heading>
      <Button colorScheme="green" mb="4" onClick={() => navigate(`/tickets/new?project=${id}`)}>Create New Ticket</Button>
      <Button colorScheme="red" mb="4" onClick={() => navigate(`/projects`)}>Back</Button>
      <Box
        maxH="70vh" // Hauteur maximale pour le conteneur de la liste des tickets
        overflowY="auto" // Activer le défilement vertical
        p="2"
        borderWidth="1px"
        borderRadius="lg"
      >
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="4">
          {tickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              id={ticket._id}
              title={ticket.title}
              description={ticket.description}
              date={ticket.createAt}
              status={ticket.status}
              priority={ticket.priority}
              assignedTo={ticket.assignedTo}
              onDelete={handleDelete}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default ProjectTickets;
