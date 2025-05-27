<script>
  import { Router, Route } from "svelte-routing";
  import { auth } from "./stores/auth";
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar.svelte";
  import LoadingOverlay from "./components/LoadingOverlay.svelte";
  import Footer from "./components/Footer.svelte";
  import Home from "./routes/Home.svelte";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Members from "./routes/Members.svelte";
  import Fees from "./routes/Fees.svelte";
  import MemberDashboard from "./routes/MemberDashboard.svelte";
  import MemberFees from "./routes/MemberFees.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import OrganizationDashboard from './routes/OrganizationDashboard.svelte';
  import MembersList from './routes/MembersList.svelte';
  import OrganizationFeeMembers from './routes/OrganizationFeeMembers.svelte';
  import RolesAndParticipation from './routes/RolesAndParticipation.svelte';
  import Alumni from './routes/Alumni.svelte';
  import Transactions from "./routes/Transactions.svelte";
  import StatusUpdates from "./routes/StatusUpdates.svelte";

  export let url = "";

  // Initialize auth store
  onMount(() => {
    auth.init();
  });
</script>

<Router {url}>
  <div class="bokeh-circle"></div>
  <div class="bokeh-circle"></div>
  <div class="bokeh-circle"></div>
  <Navbar />
  <LoadingOverlay />
  <main class="min-h-screen">
    <div class="container mx-auto px-4 py-6">
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/organization-dashboard" component={OrganizationDashboard} />
      <Route path="/member-dashboard" component={MemberDashboard} />
      <Route path="/members" component={Members} />
      <Route path="/fees" component={Fees} />
      <Route path="/member-fees" component={MemberFees} />
      <Route path="/member-fees/:orgId" component={MemberFees} />
      <Route path='/members-list' component={MembersList} />
      <Route path='/organization-fee-members' component={OrganizationFeeMembers} />
      <Route path='/roles-and-participation' component={RolesAndParticipation} />
      <Route path='/alumni' component={Alumni} />
      <Route path='/transactions' component={Transactions} />
      <Route path='/status-updates' component={StatusUpdates} />
      <Route path="*" component={NotFound} />
    </div>
  </main>
  <Footer />
</Router>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  :global(:root) {
    --text-primary: #ffffff;
    --text-secondary: #e2e8f0;
    --primary: #4f46e5;
    --primary-dark: #4338ca;
  }

  :global(.container) {
    max-width: 1200px;
  }

  :global(.glass-card) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  :global(.glass-button) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  :global(.glass-button:hover) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.glass-input) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    padding: 0.75rem 1rem;
    width: 100%;
    transition: all 0.3s ease;
  }

  :global(.glass-input:focus) {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }

  :global(.glass-badge) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
  }

  :global(.btn-primary) {
    background: var(--primary);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s;
    text-decoration: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  :global(.btn-primary:hover) {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.btn-secondary) {
    background: transparent;
    color: var(--text-primary);
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: 2px solid var(--primary);
    transition: all 0.2s;
    text-decoration: none;
  }

  :global(.btn-secondary:hover) {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
  }

  :global(.text-primary) {
    color: var(--text-primary);
  }

  :global(.text-secondary) {
    color: var(--text-secondary);
  }
</style>