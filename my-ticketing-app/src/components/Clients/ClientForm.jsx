// src/components/Clients/ClientForm.jsx
import { useState } from 'react';
import { Box, Input, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const ClientForm = ({ onSave }) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/clients', { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Client saved successfully', response.data);
      onSave();
      setName('');  // Clear the input field after saving
    } catch (error) {
      console.error('Error saving client', error);
    }
  };

  return (
    <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="white" mb="4">Client Form</Heading>
      <Input
        mb="4"
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      <Button width="100%" colorScheme="blue" onClick={handleSubmit}>
        Save Client
      </Button>
    </Box>
  );
};

export default ClientForm;
