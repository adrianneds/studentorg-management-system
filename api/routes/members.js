import express from 'express';
import {logIn, memberInfo, memberTransactions, getStudentNumber,
    getOrganizations, getMemberUnpaidFees, updateMember} from '../memberController.js';

// import all the functions from controller.js

const memberRouter = express.Router();  // use Router to define and manage the API routes 
memberRouter.post('/login', logIn);
memberRouter.get('/info/user/:user', memberInfo);
memberRouter.get('/transactions', memberTransactions);
memberRouter.get('/getStudentNumber/user/:user', getStudentNumber);
memberRouter.get('/getOrganizations/user/:user', getOrganizations);
memberRouter.get('/getUnpaidFees/user/:user', getMemberUnpaidFees);
memberRouter.post('/updateMember', updateMember);


export {memberRouter}