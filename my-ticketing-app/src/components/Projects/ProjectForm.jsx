// src/components/Projects/ProjectForm.jsx
import { useState } from 'react';
import { Box, Input, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const ProjectForm = ({ project, onSave }) => {
  const [name, setName] = useState(project ? project.name : '');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/projects', { name });
      console.log('Project saved successfully', response.data);
      onSave();
    } catch (error) {
      console.error('Error saving project', error);
    }
  };

  return (
    <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="white" mb="4">Project Form</Heading>
      <Input
        mb="4"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      <Button width="100%" colorScheme="blue" onClick={handleSubmit}>
        Save Project
      </Button>
    </Box>
  );
};

export default ProjectForm;
