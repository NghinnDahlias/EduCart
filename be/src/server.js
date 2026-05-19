const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { getPool, closePool } = require('./config/db');
const { register: registerObservers } = require('./patterns/observer');
const { repositories } = require('./container');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static serving for uploaded product images.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'EduCart backend is running' });
});

app.use(notFound);
app.use(errorHandler);

// Observer pattern: subscribe handlers to the bus once at boot.
registerObservers({
  orderRepository: repositories.orderRepository,
  productRepository: repositories.productRepository,
});

async function startServer() {
  app.listen(PORT, async () => {
    console.log(`Server is listening on port local: http://localhost:${PORT}`);
    try {
      await getPool();
      console.log('Connected to SQL Server successfully');
    } catch (error) {
      console.error(
        'SQL Server is not reachable. API is up but DB features are unavailable:',
        error.message,
      );
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

if (require.main === module) {
  startServer();
}

module.exports = app;
