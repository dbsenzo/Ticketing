// src/components/Projects/ProjectList.jsx
import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/projects')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects', error));
  }, []);

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Projects</Heading>
      <Table variant="simple">
        <Tbody>
          {projects.map(project => (
            <Tr key={project._id}>
              <Td>{project.name}</Td>
              <Td>
                <Button colorScheme="blue" mr="4">Edit</Button>
                <Button colorScheme="red">Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProjectList;
