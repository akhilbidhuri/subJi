const userRoutes = require('express').Router();
const {
  updowngrade,
  retrieve
} = require('./users.controller');

userRoutes.post('/upgrade', updowngrade);
userRoutes.post('/retrieve', retrieve);
module.exports = userRoutes;
