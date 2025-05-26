import express from 'express';
import {logIn, memberInfo, memberTransactions, getStudentNumber,
    getOrganizations} from '../memberController.js';

// import all the functions from controller.js

const memberRouter = express.Router();  // use Router to define and manage the API routes 
memberRouter.post('/login', logIn);
memberRouter.get('/info/user/:user', memberInfo);
memberRouter.get('/transactions/user/:user', memberTransactions);
memberRouter.get('/getStudentNumber/user/:user', getStudentNumber);
memberRouter.get('/getOrganizations/user/:user', getOrganizations);

export {memberRouter}