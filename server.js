require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// connect to database
connectDB();

// middleware to parse JSON
app.use(express.json());

const cors = require('cors');
const morgan = require('morgan');

app.use(cors());        // allows cross‑origin requests (e.g. frontend → backend)
app.use(morgan('dev')); // logs requests in the console

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
