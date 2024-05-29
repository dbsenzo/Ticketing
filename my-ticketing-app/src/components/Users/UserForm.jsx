// src/components/Users/UserForm.jsx
import { useState } from 'react';
import { Box, Input, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const UserForm = ({ user, onSave }) => {
  const [username, setUsername] = useState(user ? user.username : '');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/users', {
        username,
        password,
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
      <Button width="100%" colorScheme="blue" onClick={handleSubmit}>
        Save User
      </Button>
    </Box>
  );
};

export default UserForm;
