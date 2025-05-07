const express = require('express');
const {memberInfo, memberPays} = require('../memberController.js');

// import all the functions from controller.js

const memberRouter = express.Router();  // use Router to define and manage the API routes 
memberRouter.get('/info', memberInfo);
memberRouter.get('/transactions', memberPays);

module.exports = {memberRouter}