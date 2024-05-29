import { Box, Flex, Text, Badge, Avatar, Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status) {
    case 'Urgent':
      return 'red';
    case 'Solved':
      return 'green';
    case 'Open':
      return 'yellow';
    default:
      return 'gray';
  }
};

const TicketCard = ({ id, title, description, date, status, priority, assignedTo, onDelete }) => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/tickets/${id}/edit`);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <Box
      p="5"
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      mb="4"
      bg="white"
      width="100%" // Augmentez la largeur des tickets
    >
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="lg">{title}</Text>
        <Text fontSize="sm" color="gray.500">{date}</Text>
      </Flex>
      <Text mt="2" color="gray.700">{description}</Text>
      <Flex mt="4" align="center" justify="space-between">
        <Box>
          <Badge colorScheme={getStatusColor(status)}>{status}</Badge>
          <Badge ml="2" colorScheme="gray">{priority}</Badge>
        </Box>
        {assignedTo && (
          <Flex align="center">
            <Avatar size="sm" name={assignedTo.username} />
            <Text ml="2">{assignedTo.username}</Text>
          </Flex>
        )}
      </Flex>
      {role === 'Développeur' && (
        <Flex mt="4" justify="flex-end">
          <Button colorScheme="blue" size="sm" mr="2" onClick={handleEdit}>Modifier</Button>
          <Button colorScheme="red" size="sm" onClick={handleDelete}>Supprimer</Button>
        </Flex>
      )}
    </Box>
  );
};

export default TicketCard;
