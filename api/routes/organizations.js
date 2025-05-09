import express from 'express';
import {orgInfo, orgUnpaidMembers, orgCommitteeMembers,
     orgRoles, orgCountStatus, orgAlumni, orgFeeStatus, orgHighestDebt,
     orgLatePayments,orgMembers, logIn} from '../orgController.js';
// import all the functions from controller.js

const orgRouter = express.Router();  // use Router to define and manage the API routes 
orgRouter.post('/login', logIn);
orgRouter.get('/info/user/:user', orgInfo);
orgRouter.get('/unpaidMembers', orgUnpaidMembers);
orgRouter.get('/committeeMembers', orgCommitteeMembers);
orgRouter.get('/roles', orgRoles);
orgRouter.get('/memberStatus', orgCountStatus);
orgRouter.get('/alumni', orgAlumni);
orgRouter.get('/feeStatus', orgFeeStatus);
orgRouter.get('/highestDebt', orgHighestDebt);
orgRouter.get('/latePayments', orgLatePayments);
orgRouter.post('/orgMembers', orgMembers);

export {orgRouter}