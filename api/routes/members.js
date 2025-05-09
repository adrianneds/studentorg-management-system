import express from 'express';
import {logIn, memberInfo, memberTransactions} from '../memberController.js';

// import all the functions from controller.js

const memberRouter = express.Router();  // use Router to define and manage the API routes 
memberRouter.post('/login', logIn);
memberRouter.get('/info/user/:user', memberInfo);
memberRouter.get('/transactions', memberTransactions);

export {memberRouter}