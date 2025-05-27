<script>
  import { Link, navigate } from "svelte-routing";
  import { auth } from "../stores/auth";
  import { onMount } from "svelte";

  let currentPath = "";

  onMount(() => {
    currentPath = window.location.pathname;
    // Listen for route changes
    window.addEventListener('popstate', () => {
      currentPath = window.location.pathname;
    });
  });

  const handleLogout = () => {
    auth.logout();
    navigate('/home');
  };

  // Check if current route is a public route
  $: isPublicRoute = ['/', '/home', '/login', '/register'].includes(currentPath);
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900">
  {#if !isPublicRoute}
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <Link to="/home" class="text-xl font-bold text-primary">StudentOrg</Link>
            </div>
          </div>
          <div class="flex items-center">
            {#if $auth}
              {#if $auth.type === 'organization'}
                <Link to="/organization-dashboard" class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Organizations</Link>
              {:else}
                <Link to="/member-fees" class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Member Fees</Link>
              {/if}
              <button on:click={handleLogout} class="ml-4 text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            {:else}
              <Link to="/login" class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Login</Link>
              <Link to="/register" class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Register</Link>
            {/if}
          </div>
        </div>
      </div>
    </nav>
  {/if}

  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>

<style>
  :global(.container) {
    max-width: 1200px;
  }

  :global(.glass-card) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  :global(.glass-button) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  :global(.glass-button:hover) {
    background: rgba(255, 255, 255, 0.2);
  }
</style> 