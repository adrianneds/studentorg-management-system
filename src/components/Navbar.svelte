<script>
  import { Link, navigate } from "svelte-routing";
  import { auth } from "../stores/auth";

  function handleLogout() {
    auth.logout();
    navigate('/');
  }
</script>

<nav class="glass-card p-4">
  <div class="max-w-7xl mx-auto flex justify-between items-center">
    <Link to="/home" class="text-primary font-bold text-xl">StudentOrg</Link>
    
    <div class="flex items-center gap-4">
      {#if $auth}
        {#if $auth.type === 'organization'}
          <Link to="/organization-dashboard" class="nav-link" let:active>
            Dashboard
          </Link>
          <Link to="/members" class="nav-link" let:active>
            Members
          </Link>
          <Link to="/fees" class="nav-link" let:active>
            Fees
          </Link>
        {:else}
          <Link to="/member-dashboard" class="nav-link" let:active>
            Dashboard
          </Link>
          <Link to="/member-fees" class="nav-link" let:active>
            My Fees
          </Link>
        {/if}
        <button 
          on:click={handleLogout}
          class="glass-button"
        >
          Logout
        </button>
      {:else}
        <Link to="/login" class="nav-link" let:active>
          Login
        </Link>
        <Link to="/register" class="nav-link" let:active>
          Register
        </Link>
      {/if}
    </div>
  </div>
</nav>

<style>
  .nav-link {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    transition: all 0.2s;
    border-radius: 0.375rem;
  }

  .nav-link:hover {
    color: var(--text-secondary);
  }

  :global(.active) {
    color: var(--text-secondary);
  }

  .glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .glass-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>