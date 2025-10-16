# Express + MongoDB CRUD Cheat Sheet
# CRUD = Create, Read, Update, Delete

# 1. Setup
npm init -y
npm install express mongoose morgan cors http-errors dotenv
npm install --save-dev nodemon

# create folder structure
config/
controllers/
middleware/
models/
routes/

# create a .env file in project root
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/Portfolio
PORT=4000

# replace scripts in package.json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

# create server.js in project root
require('dotenv').config();
const express = require('express');

const app = express();

// simple test route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

# create config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

# to start server
npm run dev

# for deployment
npm start

# server.js skeleton
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
connectDB();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// root route
app.get('/', (req,res)=> res.json({message:"Welcome to My Portfolio application."}));

// routers
app.use('/api/contacts', require('./routes/contacts.routes'));
app.use('/api/projects', require('./routes/projects.routes'));
app.use('/api/services', require('./routes/services.routes'));
app.use('/api/users', require('./routes/users.routes'));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));

# update server.js at the top
const connectDB = require('./config/db');

# connect to database
connectDB();

# run npm run dev again and test in browser

# 2. Drop full controllers/projects.controller.js
const Project = require('../models/project.model');
const mongoose = require('mongoose');

// GET all projects
exports.getAll = async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// GET project by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// CREATE new project
exports.create = async (req, res, next) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    next(err);
  }
};

// UPDATE project by ID
exports.updateById = async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE project by ID
exports.removeById = async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

// DELETE all projects
exports.removeAll = async (req, res, next) => {
  try {
    const result = await Project.deleteMany({});
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};

# 3. Drop full models/project.model.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completion: { type: Date, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

# 4. Drop full routes/projects.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/projects.controller');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.updateById);
router.delete('/:id', ctrl.removeById);
router.delete('/', ctrl.removeAll);

module.exports = router;

# 5. Register in server.js (replace full code, order matters)
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect to database
connectDB();

// middleware to parse JSON
app.use(express.json());

// root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});

// register entity routes BEFORE liten
app.use('/api/projects', require('./routes/projects.routes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

# Testing
# Welcome message
GET http://localhost:4000/

# Other tests
GET http://localhost:4000/api/projects

# JSON
{
  "title": "Portfolio Backend",
  "completion": "2025-10-15T00:00:00.000Z",
  "description": "Node.js + Express + MongoDB"
}

# Testing flow (per entity)
- GET all → should be []
- POST two new objects
- GET by ID (use one ID)
- PUT update (change fields)
- DELETE by ID (remove the other object)
- DELETE all (clear collection)

# 5.Error Handler
# Drop to middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
}
module.exports = errorHandler;

# update server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// connect to database
connectDB();

// middleware to parse JSON
app.use(express.json());

// root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});

// register entity routes
app.use('/api/projects', require('./routes/projects.routes'));

// error handler (must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

# Add more entities if needed
- models/<entity>.model.js
- controllers/<entity>.controller.js
- routes/<entity>.routes.js
- Register in server.js
app.use('/api/<entity>', require('./routes/<entity>.routes'));

# Polish API
# Add cors and morgan to server.js

const cors = require('cors');
const morgan = require('morgan');

app.use(cors());        // allows cross‑origin requests (e.g. frontend → backend)
app.use(morgan('dev')); // logs requests in the console

# Standardise response in controllers
# Instead of 
res.json(projects);
# Do
res.json({ success: true, data: projects });

# Instead of:
res.status(404).json({ message: 'Project not found' });

# Do:
res.status(404).json({ success: false, message: 'Project not found' });

# See updated projects.controller.js for details

# Finally:
# Push to GitHub
git init

# create a file .gitignore in project root with:
node_modules
.env

# stage and commmit your code
git add .
git commit -m "Initial commit - midterm backend"

