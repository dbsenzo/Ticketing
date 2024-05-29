import { useState, useEffect } from 'react';
import { Box, Input, Textarea, Button, Heading, Select } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Open');
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };

    fetchProjects();

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
          setProject(response.data.project._id);  // Note that the project is not changeable
        } catch (error) {
          console.error('Error fetching ticket', error);
        }
      };
      fetchTicket();
    } else {
      const projectFromUrl = searchParams.get('project');
      if (projectFromUrl) {
        setProject(projectFromUrl);
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
      const payload = { title, description, priority, status, project };
      if (id) {
        await axios.put(`http://localhost:5000/tickets/${id}`, payload, config);
      } else {
        await axios.post('http://localhost:5000/tickets', payload, config);
      }
      navigate(`/projects/${project}/tickets`);
    } catch (error) {
      console.error('Error saving ticket', error);
    }
  };

  return (
    <Box p="8" bg="gray.800" shadow="lg" borderRadius="md">
      <Heading as="h2" size="xl" color="white" mb="4">Ticket Form</Heading>
      <Input
        mb="4"
        placeholder="Ticket Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      <Textarea
        mb="4"
        placeholder="Ticket Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
      />
      {!id && (
        <>
          {projects.map(proj => (
            <Input
              key={proj._id}
              mb="4"
              placeholder="Ticket Title"
              value={proj.name}
              onChange={(e) => setTitle(e.target.value)}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              disabled
            />
          ))}
        </>
      )}
      <Select
        mb="4"
        placeholder="Select Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        bg="gray.700"
        color="white"
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
        bg="gray.700"
        color="white"
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </Select>
      <Button width="100%" colorScheme="blue" onClick={handleSubmit}>
        {id ? 'Update Ticket' : 'Save Ticket'}
      </Button>
    </Box>
  );
};

export default TicketForm;
