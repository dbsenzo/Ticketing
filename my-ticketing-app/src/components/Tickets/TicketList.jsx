// src/components/Tickets/TicketList.jsx
import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tickets')
      .then(response => setTickets(response.data))
      .catch(error => console.error('Error fetching tickets', error));
  }, []);

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Tickets</Heading>
      <Table variant="simple">
        <Tbody>
          {tickets.map(ticket => (
            <Tr key={ticket._id}>
              <Td>{ticket.title}</Td>
              <Td>{ticket.description}</Td>
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

export default TicketList;
