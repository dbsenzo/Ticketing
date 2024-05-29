// src/components/Tickets/TicketForm.jsx
import { useState } from 'react';
import { Box, Input, Textarea, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const TicketForm = ({ ticket, onSave }) => {
  const [title, setTitle] = useState(ticket ? ticket.title : '');
  const [description, setDescription] = useState(ticket ? ticket.description : '');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tickets', { title, description });
      console.log('Ticket saved successfully', response.data);
      onSave();
    } catch (error) {
      console.error('Error saving ticket', error);
    }
  };

  return (
    <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="white" mb="4">Ticket Form</Heading>
      <Input
        mb="4"
        placeholder="Ticket Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      <Textarea
        mb="4"
        placeholder="Ticket Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      <Button width="100%" colorScheme="blue" onClick={handleSubmit}>
        Save Ticket
      </Button>
    </Box>
  );
};

export default TicketForm;
