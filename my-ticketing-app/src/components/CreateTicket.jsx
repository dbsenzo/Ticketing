// src/components/CreateTicket.jsx
import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, Textarea, Heading } from '@chakra-ui/react';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tickets', {
        title,
        description,
      });
      console.log('Ticket created successfully', response.data);
    } catch (error) {
      console.error('There was an error creating the ticket!', error);
    }
  };

  return (
    <Box
      className="flex justify-center items-center h-screen bg-gray-900"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.900"
    >
      <Box
        p="8"
        bg="gray.800"
        shadow="lg"
        borderRadius="md"
        width="100%"
        maxWidth="md"
      >
        <Heading as="h2" size="xl" color="white" mb="4">
          Create Ticket
        </Heading>
        <Input
          mb="4"
          placeholder="Enter the ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          bg="gray.700"
          color="white"
          _placeholder={{ color: 'gray.400' }}
        />
        <Textarea
          mb="4"
          placeholder="Enter the ticket description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          bg="gray.700"
          color="white"
          _placeholder={{ color: 'gray.400' }}
        />
        <Button
          width="100%"
          colorScheme="blue"
          onClick={handleSubmit}
        >
          Create Ticket
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTicket;
