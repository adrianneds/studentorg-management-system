import Home from './routes/Home.svelte';
import Login from './routes/Login.svelte';
import Register from './routes/Register.svelte';
import MemberFees from './routes/MemberFees.svelte';
import OrganizationDashboard from './routes/OrganizationDashboard.svelte';
import MemberDashboard from './routes/MemberDashboard.svelte';
import Members from './routes/Members.svelte';
import Fees from './routes/Fees.svelte';
import NotFound from './routes/NotFound.svelte';
import MembersList from './routes/MembersList.svelte';
import OrganizationFeeMembers from './routes/OrganizationFeeMembers.svelte';
import RolesAndParticipation from './routes/RolesAndParticipation.svelte';
import Alumni from './routes/Alumni.svelte';

// All routes
export const routes = {
  '/': Home,
  '/login': Login,
  '/register': Register,
  '/organization-dashboard': OrganizationDashboard,
  '/member-dashboard': MemberDashboard,
  '/members': Members,
  '/members/:orgId': Members,
  '/fees': Fees,
  '/fees/:orgId': Fees,
  '/member-fees': MemberFees,
  '/member-fees/:orgId': MemberFees,
  '/members-list': MembersList,
  '/organization-fee-members': OrganizationFeeMembers,
  '/roles-and-participation': RolesAndParticipation,
  '/alumni': Alumni,
  '*': NotFound // Catch-all route
}; 