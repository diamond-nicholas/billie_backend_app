const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRouter = require('./routes/userRoutes');
const vendorRouter = require('./routes/vendorRoutes');

const app = express();

dotenv.config();

const { PORT } = process.env;

app.use(express.json());
app.use(cors());

app.use('/api/v2/users', userRouter);
app.use('/api/v2/vendors', vendorRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
