const express = require('express');
const requestValidator = require('express-validator');
const cors = require('cors');
const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const allRoutes = require('./routes');

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(requestValidator());

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Welcome to Subscription Management Services',
  });
});

app.use(allRoutes);
app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));


module.exports = app;
