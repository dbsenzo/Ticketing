import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Heading, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';
import ClientForm from './ClientForm';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [editName, setEditName] = useState('');
  const toast = useToast();

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

  const handleEdit = (client) => {
    setEditingClient(client);
    setEditName(client.name);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/clients/${editingClient._id}`, { name: editName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingClient(null);
      fetchClients();
      toast({
        title: 'Client updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating client', error);
      toast({
        title: 'Error updating client.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (clientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchClients();
      toast({
        title: 'Client deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting client', error);
      toast({
        title: 'Error deleting client.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Clients</Heading>
      <ClientForm onSave={fetchClients} />
      <Table variant="simple">
        <Tbody>
          {clients.map(client => (
            <Tr key={client._id}>
              <Td>
                {editingClient && editingClient._id === client._id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  client.name
                )}
              </Td>
              <Td>
                {editingClient && editingClient._id === client._id ? (
                  <Button colorScheme="green" mr="4" onClick={handleUpdate}>
                    Save
                  </Button>
                ) : (
                  <Button colorScheme="blue" mr="4" onClick={() => handleEdit(client)}>
                    Edit
                  </Button>
                )}
                <Button colorScheme="red" onClick={() => handleDelete(client._id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ClientList;
