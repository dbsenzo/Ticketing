const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Project = require('./models/Project');
const Client = require('./models/Client');

const app = express();
const PORT = 5000;
const uri = "mongodb+srv://absimulator:hziHZKpMxVbw0t2p@cluster0.1covks1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const jwtSecret = 'your_jwt_secret';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB!");
})
.catch((error) => {
  console.error("Error connecting to MongoDB: ", error);
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Registration Endpoint
app.post("/auth/register", async (req, res) => {
  const { username, password, role } = req.body;
  console.log(username, password, role);
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user or client based on role
    let newUser;
    if (role) {
      newUser = new User({ username, password: hashedPassword, role });
    } else {
      newUser = new User({ username, password: hashedPassword, role: 'Client' });
    }

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error); // Log the error for debugging
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login Endpoint
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Token Check Endpoint
app.get("/auth/check", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Ticket Endpoints

// Get all tickets
app.get('/tickets', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('project').sort({ priority: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
});

// Get a ticket by ID
app.get('/tickets/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById(id).populate('project');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
});

// Create a new ticket
app.post('/tickets', verifyToken, async (req, res) => {
  const { title, description, priority, status, project, assignedTo } = req.body;
  try {
    const newTicket = new Ticket({ title, description, priority, status, project, assignedTo });
    await newTicket.save();
    await Project.findByIdAndUpdate(project, { $push: { tickets: newTicket._id } });
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
});

// Update a ticket by ID
app.put('/tickets/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, assignedTo } = req.body; // Include assignedTo
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.title = title;
    ticket.description = description;
    ticket.priority = priority;
    ticket.status = status;
    ticket.assignedTo = assignedTo;

    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
});


// Delete a ticket by ID
app.delete('/tickets/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    await Project.findByIdAndUpdate(deletedTicket.project, { $pull: { tickets: deletedTicket._id } });
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
});

// Project Endpoints

// Get all projects
app.get('/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find().populate('tickets');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get tickets for a specific project
app.get('/projects/:id/tickets', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const tickets = await Ticket.find({ project: id });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
});


// Get a project by ID
app.get('/projects/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate('tickets');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Create a new project
app.post('/projects', verifyToken, async (req, res) => {
  const { name } = req.body;
  try {
    const newProject = new Project({ name });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// Update a project by ID
app.put('/projects/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// Delete a project by ID
app.delete('/projects/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

// Client Endpoints

// Get all clients
app.get('/clients', verifyToken, async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
});

// Create a new client
app.post('/clients', verifyToken, async (req, res) => {
  const { name } = req.body;
  try {
    const newClient = new Client({ name });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
});

// Update a client by ID
app.put('/clients/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedClient = await Client.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
});

// Delete a client by ID
app.delete('/clients/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
});

// Get all users (add this route if not already present)
app.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get statistics
app.get('/statistics', verifyToken, async (req, res) => {
  try {
    const ticketsPerMonth = await Ticket.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ticketsPerUser = await Ticket.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $sort: { count: -1 } }
    ]);

    const ticketsPerProject = await Ticket.aggregate([
      {
        $group: {
          _id: "$project",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project"
        }
      },
      { $sort: { count: -1 } }
    ]);

    const ticketsPerStatus = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const avgResolutionTime = await Ticket.aggregate([
      {
        $match: { status: "Closed" }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: { $subtract: ["$updatedAt", "$createdAt"] } }
        }
      }
    ]);

    res.status(200).json({
      ticketsPerMonth,
      ticketsPerUser,
      ticketsPerProject,
      ticketsPerStatus,
      avgResolutionTime: avgResolutionTime.length > 0 ? avgResolutionTime[0].avgTime : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
