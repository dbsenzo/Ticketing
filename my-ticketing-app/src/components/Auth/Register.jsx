// src/components/Auth/Register.jsx
import { useState } from 'react';
import { Box, Input, Button, Heading, Center, Image } from '@chakra-ui/react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        password,
        role: 'Rapporteur'
      });
      console.log('Registration successful', response.data);
      // Handle successful registration
    } catch (error) {
      console.error('Error registering', error);
    }
  };

  return (
    <Center h="100vh" w="100vw" bg="white">
      <Box className="flex justify-center items-center h-screen bg-gray-900">
        <Box p="8" bg="white" shadow="dark-lg" borderRadius="md">
          <Box display="flex" alignItems="baseline">
            <Heading as="h2" size="xl" color="black" mb="4">
              Register
            </Heading>
            <Image src="registergif.gif" ml="4"/>
          </Box>
          <Input
            mb="4"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            bg="white"
            color="black"
            _placeholder={{ color: 'gray.700' }}
          />
          <Input
            mb="4"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="white"
            color="black"
            _placeholder={{ color: 'gray.700' }}
          />
          <Button width="100%" colorScheme="_blue" onClick={handleSubmit}>
            Register
          </Button>
        </Box>
      </Box>
    </Center>
  );
};

export default Register;
