const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

const { PORT } = process.env;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
