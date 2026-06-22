const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
const newsRoutes = require('./routes/newsRoutes');

app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'InfoPulse API is running' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Basic startup log
  console.log(`InfoPulse backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
