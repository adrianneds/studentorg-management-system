import express from 'express';
import {orgInfo, orgUnpaidMembers, orgCommitteeMembers,
     orgRoles, orgCountStatus, orgAlumni, orgFeeStatus, orgHighestDebt,
     orgLatePayments,orgMembers, logIn} from '../orgController.js';
// import all the functions from controller.js

const orgRouter = express.Router();  // use Router to define and manage the API routes 
orgRouter.post('/login', logIn);
orgRouter.get('/info/user/:user', orgInfo);
orgRouter.get('/unpaidMembers/user/:user', orgUnpaidMembers);
orgRouter.get('/committeeMembers/user/:user', orgCommitteeMembers);
orgRouter.get('/roles', orgRoles);
orgRouter.get('/memberStatus/user/:user', orgCountStatus);
orgRouter.get('/alumni', orgAlumni);
orgRouter.get('/feeStatus/user/:user', orgFeeStatus);
orgRouter.get('/highestDebt/user/:user', orgHighestDebt);
orgRouter.get('/latePayments/user/:user', orgLatePayments);
orgRouter.post('/orgMembers/user/:user', orgMembers);

export {orgRouter}