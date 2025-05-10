import express from 'express';
import {orgInfo, orgUnpaidMembers, orgCommitteeMembers,
     orgRoles, orgCountStatus, orgAlumni, orgFeeStatus, orgHighestDebt,
     orgLatePayments,orgMembers, logIn, addFee, deleteFee, addPays, deletePays,
     addStatusUpdate} from '../orgController.js';
// import all the functions from controller.js

const orgRouter = express.Router();  // use Router to define and manage the API routes 
orgRouter.post('/login', logIn);
orgRouter.get('/info/user/:user', orgInfo);
orgRouter.get('/unpaidMembers/user/:user', orgUnpaidMembers);
orgRouter.get('/committeeMembers/user/:user', orgCommitteeMembers);
orgRouter.get('/roles/user/:user', orgRoles);
orgRouter.get('/memberStatus/user/:user', orgCountStatus);
orgRouter.get('/alumni/user/:user', orgAlumni);
orgRouter.get('/feeStatus/user/:user', orgFeeStatus);
orgRouter.get('/highestDebt/user/:user', orgHighestDebt);
orgRouter.get('/latePayments/user/:user', orgLatePayments);
orgRouter.post('/orgMembers/user/:user', orgMembers);
orgRouter.post('/addFee', addFee);
orgRouter.post('/deleteFee', deleteFee);
orgRouter.post('/addTransaction', addPays);
orgRouter.post('/deleteTransaction', deletePays);
orgRouter.post('/addStatusUpdate', addStatusUpdate);


export {orgRouter}