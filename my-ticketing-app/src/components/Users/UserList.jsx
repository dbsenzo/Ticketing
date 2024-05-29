// src/components/Users/UserList.jsx
import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users', error));
  }, []);

  return (
    <Box p="8">
      <Heading as="h2" size="xl" mb="4">Users</Heading>
      <Table variant="simple">
        <Tbody>
          {users.map(user => (
            <Tr key={user._id}>
              <Td>{user.username}</Td>
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

export default UserList;
