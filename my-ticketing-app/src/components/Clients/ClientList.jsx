// src/components/Clients/ClientList.jsx
import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';
import ClientForm from './ClientForm';

const ClientList = () => {
  const [clients, setClients] = useState([]);

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
    fetchClients();
  }, []);

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Clients</Heading>
      <ClientForm onSave={fetchClients} />
      <Table variant="simple">
        <Tbody>
          {clients.map(client => (
            <Tr key={client._id}>
              <Td>{client.name}</Td>
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

export default ClientList;
