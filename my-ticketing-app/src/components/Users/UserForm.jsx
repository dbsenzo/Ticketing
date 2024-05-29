import { useState } from 'react';
import { Box, Input, Button, Heading, Select } from '@chakra-ui/react';
import axios from 'axios';

const UserForm = ({ user, onSave }) => {
  const [username, setUsername] = useState(user ? user.username : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user ? user.role : '');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/users', {
        username,
        password,
        role,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User saved successfully', response.data);
      onSave();
    } catch (error) {
      console.error('Error saving user', error);
    }
  };

  return (
    <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="white" mb="4">User Form</Heading>
      <Input
        mb="4"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      <Input
        mb="4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      <Select
        mb="4"
        placeholder="Select role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        bg="gray.700"
        color="white"
      >
        <option value="Développeur">Développeur</option>
        <option value="Rapporteur">Rapporteur</option>
      </Select>
      <Button width="100%" colorScheme="blue" onClick={handleSubmit}>
        Save User
      </Button>
    </Box>
  );
};

export default UserForm;
