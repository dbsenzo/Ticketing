// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Client = require('./models/Client');
const app = express();
const jwtSecret = 'your_jwt_secret';
const PORT = 5000;
const uri = "mongodb+srv://absimulator:hziHZKpMxVbw0t2p@cluster0.1covks1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB!");
}).catch((error) => {
  console.error("Error connecting to MongoDB: ", error);
});

app.post("/auth/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, role });
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

// Token Check Endpoint
app.get("/auth/check", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});


// User Endpoints

// Get all users
app.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Create a new user
app.post('/users', verifyToken, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Update a user
app.put('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(id, { username, password: hashedPassword, role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete a user
app.delete('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
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

// Update a client
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

// Delete a client
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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
