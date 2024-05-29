import { useState } from 'react';
import { Box, Input, Button, Heading, Text, Center, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login(username, password, navigate);
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <Center h="100vh" w="100vw" bg="white">
      <Box className="flex justify-center items-center h-screen bg-gray-900">
        <Box p="8" bg="white" shadow="dark-lg" borderRadius="md">
        <Box display="flex" alignItems="baseline">
            <Heading as="h2" size="xl" color="black" mb="4">
              Login
            </Heading>
            <Image src="logingif.gif" ml="4"/>
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
            color="black"
            bg="white"
            _placeholder={{ color: 'gray.700' }}
          />
          {error && (
            <Text color="red.500" mb="4">
              {error}
            </Text>
          )}
          <Button width="100%" colorScheme="_blue" onClick={handleSubmit}>
            Login
          </Button>
        </Box>
      </Box>
    </Center>
  );
};

export default Login;
