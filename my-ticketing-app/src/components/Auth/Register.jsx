// src/components/Auth/Register.jsx
import { useState } from 'react';
import { Box, Input, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        password,
      });
      console.log('Registration successful', response.data);
      // Handle successful registration
    } catch (error) {
      console.error('Error registering', error);
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-900">
      <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
        <Heading as="h2" size="xl" color="white" mb="4">Register</Heading>
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
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
