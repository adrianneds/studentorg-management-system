import express from 'express';
import {memberInfo} from '../memberController.js';

// import all the functions from controller.js

const memberRouter = express.Router();  // use Router to define and manage the API routes 
memberRouter.get('/info', memberInfo);
// memberRouter.get('/transactions', memberPays);

export {memberRouter}