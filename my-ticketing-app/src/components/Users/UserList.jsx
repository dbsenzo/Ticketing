import { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, Button, Heading, Tag, Input, Select, useToast, Center, Thead } from '@chakra-ui/react';
import axios from 'axios';
import UserForm from './UserForm';
import NavBar from './NavBar'

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState('');
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditRole(user.role);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/users/${editingUser._id}`, {
        username: editUsername,
        password: editingUser.password,
        role: editRole,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingUser(null);
      fetchUsers();
      toast({
        title: 'User updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating user', error);
      toast({
        title: 'Error updating user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
      toast({
        title: 'User deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting user', error);
      toast({
        title: 'Error deleting user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
    <NavBar />
    <Box ml="250px" p="8" bg="white">
          <Heading color="brand.500" as="h2" size="xl" mb="4">Gestion des users</Heading>
          <UserForm onSave={fetchUsers}/>
          <Center w="77.5vw" />
        <br />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(user => (
              <Tr key={user._id}>
                <Td>{user.username}</Td>
                <Td>
                  <Tag variant='outline' colorScheme='brand'>
                    {user.role}
                  </Tag>
                </Td>
                <Td>
                  {editingUser && editingUser._id === user._id ? (
                    <>
                      <Input
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        mb="4"
                      />
                      <Select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        mb="4"
                      >
                        <option value="Développeur">Développeur</option>
                        <option value="Rapporteur">Rapporteur</option>
                      </Select>
                      <Button colorScheme="green" mr="4" onClick={handleUpdate}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button colorScheme="_blue" mr="4" borderRadius={"0px"} onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                      <Button colorScheme="red" borderRadius={"0px"} onClick={() => handleDelete(user._id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default UserList;