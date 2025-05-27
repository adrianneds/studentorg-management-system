<script>
  import { Link, navigate } from "svelte-routing";
  import { auth } from "../stores/auth";

  function handleLogout() {
    auth.logout();
    navigate('/');
  }
</script>

<nav class="sticky top-0 z-50">
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between px-8 py-3">
      <Link to="/home" class="text-primary font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-300">
        StudentOrg
      </Link>
      
      <div class="flex items-center space-x-6">
        {#if $auth}
          {#if $auth.type === 'organization'}
            <Link to="/organization-dashboard" class="nav-link" let:active title="Dashboard">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link to="/members" class="nav-link" let:active title="Members">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </Link>
            <Link to="/fees" class="nav-link" let:active title="Fees">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
          {:else}
            <Link to="/member-dashboard" class="nav-link" let:active title="Dashboard">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link to="/member-fees" class="nav-link" let:active title="My Fees">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
          {/if}
          <div class="h-6 w-px bg-white/10 mx-4"></div>
          <button 
            on:click={handleLogout}
            class="glass-button flex items-center space-x-2"
            title="Logout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        {:else}
          <Link to="/login" class="nav-link" let:active title="Login">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </Link>
          <Link to="/register" class="nav-link" let:active title="Register">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </Link>
        {/if}
      </div>
    </div>
  </div>
</nav>

<style>
  .nav-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    color: var(--text-primary);
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :global(.active) {
    background: linear-gradient(to right, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
    border-color: rgba(139, 92, 246, 0.2);
    color: var(--text-secondary);
  }

  .glass-button {
    background: linear-gradient(to right, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
    backdrop-filter: blur(5px);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
  }

  .glass-button:hover {
    background: linear-gradient(to right, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.25));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>