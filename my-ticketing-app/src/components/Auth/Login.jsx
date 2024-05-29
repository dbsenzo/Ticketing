// src/components/Auth/Login.jsx
import { useState } from 'react';
import { Box, Input, Button, Heading, Text } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      await login(username, password);
      // Clear the form and error state on successful login
      setUsername('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error('Error logging in', error);
      setError(error.message);
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-900">
      <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
        <Heading as="h2" size="xl" color="white" mb="4">Login</Heading>
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
        {error && (
          <Text color="red.500" mb="4">
            {error}
          </Text>
        )}
        <Button width="100%" colorScheme="blue" onClick={handleSubmit}>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
