import { useState, useEffect } from 'react';
import { Box, Flex, Table, Tbody, Tr, Td, Button, Heading, Progress, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectForm from './ProjectForm';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  const handleSave = () => {
    fetchProjects();
  };

  const calculateCompletedPercentage = (tickets) => {
    if (!tickets.length) return 0;
    const completedTickets = tickets.filter(ticket => ticket.status === 'Closed').length;
    return (completedTickets / tickets.length) * 100;
  };

  const getClientName = (clientId) => {
    const client = clients.find(client => client._id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Projects</Heading>
      <Flex justifyContent={'space-between'}>
        <Table variant="simple" width={'max-content'}>
          <Tbody>
            {projects.map(project => (
              <Tr key={project._id}>
                <Td>
                  <Heading as="h3" size="md" mb="2">{project.name}</Heading>
                  <Text mb="2">Client: {getClientName(project.client)}</Text>
                  <Text mb="2">{project.tickets.filter(ticket => ticket.status === 'Closed').length}/{project.tickets.length} tickets completed</Text>
                  <Progress value={calculateCompletedPercentage(project.tickets)} size="sm" colorScheme="green" />
                </Td>
                <Td>
                  <Button colorScheme="purple" mr="4" onClick={() => navigate(`/projects/${project._id}/tickets`)}>View Tickets</Button>
                  <Button colorScheme="red" onClick={() => handleDelete(project._id)}>Delete</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Box>
          <ProjectForm onSave={handleSave} />
        </Box>

      </Flex>
    </Box>
  );
};

export default ProjectList;
