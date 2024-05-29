import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Td, Button, Heading, Progress, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectForm from './ProjectForm';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
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

  useEffect(() => {
    fetchProjects();
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

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Projects</Heading>
      <ProjectForm onSave={handleSave} />
      <Table variant="simple">
        <Tbody>
          {projects.map(project => (
            <Tr key={project._id}>
              <Td>
                <Heading as="h3" size="md" mb="2">{project.name}</Heading>
                <Text mb="2">{project.tickets.filter(ticket => ticket.status === 'Closed').length}/{project.tickets.length} tickets completed</Text>
                <Progress value={calculateCompletedPercentage(project.tickets)} size="sm" colorScheme="green" />
              </Td>
              <Td>
                <Button colorScheme="blue" mr="4" onClick={() => navigate(`/projects/${project._id}/tickets`)}>View Tickets</Button>
                <Button colorScheme="red" onClick={() => handleDelete(project._id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProjectList;
