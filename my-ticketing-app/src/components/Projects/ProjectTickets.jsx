import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Td, Button, Heading, Avatar, VStack, Tag, Badge } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const getUsername = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.username : 'Unassigned';
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
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Tickets for Project</Heading>
      <Button colorScheme="green" mb="4" onClick={() => navigate(`/tickets/new?project=${id}`)}>Create New Ticket</Button>
      <Button colorScheme="red" mb="4" onClick={() => navigate(`/projects`)}>Back</Button>
      <Table variant="simple">
        <Tbody>
          {tickets.map(ticket => (
            <Tr key={ticket._id}>
              <Td>{ticket.title}</Td>
              <Td>{ticket.description}</Td>
              <Td><Badge colorScheme={getBadgeColor(ticket.priority)}>{ticket.priority}</Badge></Td>
              <Td><Tag colorScheme={getTagColor(ticket.status)}>{ticket.status}</Tag></Td>
              <Td>
                {ticket.assignedTo ? (
                  <VStack>
                    <Avatar size="sm" />
                    <Box>{getUsername(ticket.assignedTo)}</Box>
                  </VStack>
                ) : (
                  'Unassigned'
                )}
              </Td>
              <Td>
                <Button colorScheme="blue" mr="4" onClick={() => navigate(`/tickets/${ticket._id}`, { state: { projectId: id } })}>View</Button>
                <Button colorScheme="red" onClick={() => handleDelete(ticket._id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProjectTickets;
