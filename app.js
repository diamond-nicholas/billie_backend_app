const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

const userRouter = require('./routes/userRoutes');
const vendorRouter = require('./routes/vendorRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const swaggerDocs = require('./swagger.json');

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.get('/login', (req, res) => {
  res.render('login');
});
app.use('/api/v2/users', userRouter);
app.use('/api/v2/vendors', vendorRouter);
app.use('/api/v2/products', productRouter);
app.use('/api/v2/cart', cartRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v2/', (req, res) => {
  res.send('API up and running');
});

app.get('*', (req, res) => {
  res.redirect('/api/v2');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
