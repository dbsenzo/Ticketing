import { Box, Flex, Avatar, Text, VStack, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTicketAlt, FaUsers, FaCommentDots } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { name, logout } = useAuth();

  return (
    <Flex
      direction="column"
      height="100vh"
      width="250px"
      backgroundColor="white"
      boxShadow="lg"
      padding="20px"
      justifyContent="space-between"
    >
      <Box>
        <Box mb="6" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">
            TikSy
          </Text>
        </Box>
        <VStack spacing="4" align="start">
          <NavLink
            to="/projects"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'purple' : 'transparent',
              color: isActive ? 'white' : 'black',
              width: '100%',
              padding: '10px 15px',
              borderRadius: '8px',
              textDecoration: 'none', // To ensure no underline
            })}
          >
            <Flex align="center">
              <FaHome />
              <Text ml="3">Overview</Text>
            </Flex>
          </NavLink>
          <NavLink
            to="/statistics"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'purple' : 'transparent',
              color: isActive ? 'white' : 'black',
              width: '100%',
              padding: '10px 15px',
              borderRadius: '8px',
              textDecoration: 'none', // To ensure no underline
            })}
          >
            <Flex align="center">
              <FaTicketAlt />
              <Text ml="3">Tickets</Text>
            </Flex>
          </NavLink>
          <NavLink
            to="/utilisateurs"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'purple' : 'transparent',
              color: isActive ? 'white' : 'black',
              width: '100%',
              padding: '10px 15px',
              borderRadius: '8px',
              textDecoration: 'none', // To ensure no underline
            })}
          >
            <Flex align="center">
              <FaUsers />
              <Text ml="3">Teams</Text>
            </Flex>
          </NavLink>
          <NavLink
            to="/clients"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'purple' : 'transparent ',
              color: isActive ? 'white' : 'black',
              width: '100%',
              padding: '10px 15px',
              borderRadius: '8px',
              textDecoration: 'none', // To ensure no underline
            })}
          >
            <Flex align="center">
              <FaCommentDots />
              <Text ml="3">Clients</Text>
            </Flex>
          </NavLink>
        </VStack>
      </Box>
      <Box>
        <Flex align="center" mb="4">
          <Avatar size="sm" name={name} />
          <Box ml="3">
            <Text fontWeight="bold">{name}</Text>
            <Text fontSize="sm" color="gray">@{name}</Text>
          </Box>
        </Flex>
        <Button size="sm" colorScheme="purple" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Flex>
  );
};

export default Sidebar;
