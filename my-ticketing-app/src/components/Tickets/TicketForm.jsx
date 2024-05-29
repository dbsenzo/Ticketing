import { useState, useEffect } from 'react';
import { Box, Input, Textarea, Button, Heading, Select } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Open');
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        const userResponse = await axios.get('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(userResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchProjectsAndUsers();

    const fetchProjectName = async (projectId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjectName(response.data.name);
      } catch (error) {
        console.error('Error fetching project name', error);
      }
    };

    if (id) {
      const fetchTicket = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/tickets/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTitle(response.data.title);
          setDescription(response.data.description);
          setPriority(response.data.priority);
          setStatus(response.data.status);
          setAssignedTo(response.data.assignedTo || '');
          await fetchProjectName(response.data.project._id);
        } catch (error) {
          console.error('Error fetching ticket', error);
        }
      };
      fetchTicket();
    } else {
      const projectFromUrl = searchParams.get('project');
      if (projectFromUrl) {
        fetchProjectName(projectFromUrl);
      }
    }
  }, [id, searchParams]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = { title, description, priority, status, assignedTo };
      let response;
      if (id) {
        response = await axios.put(`http://localhost:5000/tickets/${id}`, payload, config);
      } else {
        const projectId = searchParams.get('project');
        response = await axios.post('http://localhost:5000/tickets', { ...payload, project: projectId }, config);
      }
      navigate(`/projects/${searchParams.get('project') || response.data.project}/tickets`);
    } catch (error) {
      console.error('Error saving ticket', error);
    }
  };

  return (
    <Box p="8" bg="white" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="black" mb="4">
        {id ? 'Update Ticket' : 'Create Ticket'}
      </Heading>
      <Input
        mb="4"
        placeholder="Ticket Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        bg="white"
        color="black"
        _placeholder={{ color: 'gray' }}
      />
      <Textarea
        mb="4"
        placeholder="Ticket Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        bg="white"
        color="black"
        _placeholder={{ color: 'gray' }}
      />
      <Input
        mb="4"
        placeholder="Project Name"
        value={projectName}
        isDisabled
        bg="white"
        color="black"
        _placeholder={{ color: 'gray' }}
      />
      <Select
        mb="4"
        placeholder="Select Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        bg="white"
        color="black"
      >
        <option value="Low">Low</option>
        <option value="Mid">Mid</option>
        <option value="High">High</option>
      </Select>
      <Select
        mb="4"
        placeholder="Select Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        bg="white"
        color="gray"
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </Select>
      <Select
        mb="4"
        placeholder="Assign to"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        bg="white"
        color="gray"
      >
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.username}
          </option>
        ))}
      </Select>
      <Button width="100%" colorScheme="purple" borderRadius={0} onClick={handleSubmit}>
        {id ? 'Update Ticket' : 'Save Ticket'}
      </Button>
    </Box>
  );
};

export default TicketForm;
