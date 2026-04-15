const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const healthRoutes = require('./routes/health.routes');
const { getPool, closePool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', healthRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'EduCart backend is running' });
});

async function startServer() {
  app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);

    try {
      await getPool();
      console.log('Connected to SQL Server successfully');
    } catch (error) {
      console.error('SQL Server is not reachable. API is up but DB features are unavailable:', error.message);
    }
  });
}

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

startServer();
