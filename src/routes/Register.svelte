<script>
  import { Link, navigate } from "svelte-routing";
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  
  let userType = 'member';
  let loading = false;
  let error = '';
  let success = false;

  // Member form fields
  let memberName = '';
  let memberUsername = '';
  let memberPassword = '';
  let memberConfirmPassword = '';
  let memberEmail = '';
  let memberPhone = '';

  // Organization form fields
  let orgName = '';
  let orgUsername = '';
  let orgPassword = '';
  let orgConfirmPassword = '';
  let orgEmail = '';
  let orgPhone = '';
  let orgDescription = '';

  onMount(() => {
    if ($auth) {
      if ($auth.type === 'organization') {
        navigate('/organization-dashboard');
      } else if ($auth.type === 'member') {
        navigate('/member-fees');
      }
    }
  });

  function handleRegister() {
    loading = true;
    error = '';
    
    // Validate passwords match
    if (userType === 'member') {
      if (memberPassword !== memberConfirmPassword) {
        error = 'Passwords do not match';
        loading = false;
        return;
      }
    } else {
      if (orgPassword !== orgConfirmPassword) {
        error = 'Passwords do not match';
        loading = false;
        return;
      }
    }

    // Simulate registration
    setTimeout(() => {
      if (userType === 'member') {
        if (memberUsername === 'johndoe') {
          error = 'Username already exists';
        } else {
          success = true;
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        if (orgUsername === 'compsoc') {
          error = 'Username already exists';
        } else {
          success = true;
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
      loading = false;
    }, 1000);
  }
</script>

<div class="h-[calc(100vh-6rem)] flex items-center justify-center py-8">
  <div class="w-full max-w-4xl px-4">
    <Link to="/home" class="glass-button py-2 px-4 mb-4 inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Home
    </Link>

    <div class="glass-card p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Create Account</h1>
        <p class="text-secondary">Join our community today</p>
      </div>

      {#if error}
        <div class="glass-badge bg-gradient-to-r from-red-500/20 to-pink-500/20 mb-6 p-4 text-center">
          {error}
        </div>
      {/if}

      {#if success}
        <div class="glass-badge bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-6 p-4 text-center">
          Registration successful! Redirecting to login...
        </div>
      {/if}

      <div class="space-y-6 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
        <div>
          <label class="block text-secondary text-sm font-medium mb-3">Account Type</label>
          <div class="flex gap-4">
            <button 
              class="flex-1 glass-button py-3 {userType === 'member' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' : ''}"
              on:click={() => userType = 'member'}
            >
              Member
            </button>
            <button 
              class="flex-1 glass-button py-3 {userType === 'organization' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' : ''}"
              on:click={() => userType = 'organization'}
            >
              Organization
            </button>
          </div>
        </div>

        {#if userType === 'member'}
          <div class="space-y-6">
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Full Name</label>
              <input 
                type="text" 
                bind:value={memberName}
                class="glass-input"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Username</label>
              <input 
                type="text" 
                bind:value={memberUsername}
                class="glass-input"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Email</label>
              <input 
                type="email" 
                bind:value={memberEmail}
                class="glass-input"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Phone</label>
              <input 
                type="tel" 
                bind:value={memberPhone}
                class="glass-input"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Password</label>
              <input 
                type="password" 
                bind:value={memberPassword}
                class="glass-input"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Confirm Password</label>
              <input 
                type="password" 
                bind:value={memberConfirmPassword}
                class="glass-input"
                placeholder="Confirm your password"
              />
            </div>
          </div>
        {:else}
          <div class="space-y-6">
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Organization Name</label>
              <input 
                type="text" 
                bind:value={orgName}
                class="glass-input"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Username</label>
              <input 
                type="text" 
                bind:value={orgUsername}
                class="glass-input"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Email</label>
              <input 
                type="email" 
                bind:value={orgEmail}
                class="glass-input"
                placeholder="Enter organization email"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Phone</label>
              <input 
                type="tel" 
                bind:value={orgPhone}
                class="glass-input"
                placeholder="Enter organization phone"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Password</label>
              <input 
                type="password" 
                bind:value={orgPassword}
                class="glass-input"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Confirm Password</label>
              <input 
                type="password" 
                bind:value={orgConfirmPassword}
                class="glass-input"
                placeholder="Confirm your password"
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-3">Description</label>
              <textarea 
                bind:value={orgDescription}
                class="glass-input h-32 resize-none"
                placeholder="Describe your organization"
              ></textarea>
            </div>
          </div>
        {/if}

        <button 
          class="glass-button w-full py-3 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
          on:click={handleRegister}
          disabled={loading}
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          {:else}
            Create Account
          {/if}
        </button>

        <div class="text-center pt-4">
          <p class="text-secondary text-sm">
            Already have an account? 
            <Link to="/login" class="text-primary hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  h1 {
    color: var(--text-primary);
  }
</style> 