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

  const chakraStyles = {
      option: (provided) => ({
        ...provided,
        color: "black"
      }),
    };

  return (
    <Box p="8" bg="white" shadow="lg" borderRadius="md">
      <Heading as="h2" size="lg" color="gray.700" mb="4">Add an user</Heading>
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
      <Select
        mb="4"
        placeholder="Select role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        bg="white"
        color="black"
      >
        <option value="Développeur">Développeur</option>
        <option value="Rapporteur">Rapporteur</option>
      </Select>
      <Button marginLeft="75%" width="25%" colorScheme="_blue" borderRadius={"0px"} onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
};

export default UserForm;
