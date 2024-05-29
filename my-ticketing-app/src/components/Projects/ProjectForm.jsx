import { useState, useEffect } from 'react';
import { Box, Input, Button, Heading, Select } from '@chakra-ui/react';
import axios from 'axios';

const ProjectForm = ({ project, onSave }) => {
  const [name, setName] = useState(project ? project.name : '');
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState('');

  useEffect(() => {
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

    fetchClients();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/projects', { name, client }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Project saved successfully', response.data);
      setName(''); // Clear the input field
      setClient(''); // Clear the client field
      onSave(); // Call the onSave callback to update the project list
    } catch (error) {
      console.error('Error saving project', error);
    }
  };

  return (
    <Box p="8" bg="white" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="black" mb="4">Create a project</Heading>
      <Input
        mb="4"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        bg="white"
        color="gray"
        _placeholder={{ color: 'gray' }}
      />
      <Select
        mb="4"
        placeholder="Select Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        bg="white"
        color="gray"
      >
        {clients.map(client => (
          <option key={client._id} value={client._id}>
            {client.name}
          </option>
        ))}
      </Select>
      <Button width="100%" colorScheme="purple" onClick={handleSubmit}>
        Create Project
      </Button>
    </Box>
  );
};

export default ProjectForm;
