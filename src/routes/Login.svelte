<script>
  import { Link, navigate } from "svelte-routing";
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  
  let username = '';
  let password = '';
  let userType = 'member'; // 'member' or 'organization'
  let error = '';
  let loading = false;
  let id = '';
  let studno = '';

  onMount(() => {
    // Check if user is already logged in
    if ($auth) {
      if ($auth.type === 'organization') {
        navigate('/organization-dashboard');
      } else if ($auth.type === 'member') {
        navigate('/member-dashboard');
      }
    }
  });

    async function getOrganizationId(username) {
      await fetch(`http://localhost:5000/organization/getOrganizationId/user/${username}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        id = data[0].organization_id;
      }).catch(error => {
        console.log(error);
        return '';
      });
  }; 

    async function getStudentNumber(username) {
      await fetch(`http://localhost:5000/member/getStudentNumber/user/${username}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        studno = data[0].student_number;
        //console.log(id)
      }).catch(error => {
        console.log(error);
        return '';
      });
  }; 

  async function handleLogin() {
    loading = true;
    error = '';
    
    setTimeout(async() => {
      if (userType === 'member') {
        // Check member credentials
        // if (username === 'johndoe' && password === 'password') {
        if (auth.validateCredentials(username, password, 'member')) {
          await getStudentNumber(username);
          auth.login({
            type: 'member',
            member_username: username,
            student_number: studno
          });
          navigate('/member-dashboard');
        } else {
          error = 'Invalid member credentials';
        }
      } else {
        // Check organization credentials
        // if (username === 'compsoc' && password === 'password') {
        if (auth.validateCredentials(username, password, 'organization')) {
          await getOrganizationId(username);
          auth.login({
            type: 'organization',
            organization_username: username,
            organization_id: id
          });
          navigate('/organization-dashboard');
        } else {
          error = 'Invalid organization credentials';
        }
      }
      loading = false;
    }, 1000);
  }
</script>

<div class="h-[calc(100vh-6rem)] flex items-center justify-center py-8">
  <div class="w-full max-w-md px-4">
    <Link to="/home" class="glass-button py-2 px-4 mb-8 inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Home
    </Link>

    <div class="glass-card p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
        <p class="text-secondary">Sign in to your account</p>
      </div>

      {#if error}
        <div class="glass-badge bg-gradient-to-r from-red-500/20 to-pink-500/20 mb-6 p-4 text-center">
          {error}
        </div>
      {/if}

      <div class="space-y-6">
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

        <div>
          <label class="block text-secondary text-sm font-medium mb-3">
            {userType === 'member' ? 'Member Username' : 'Organization Username'}
          </label>
          <input 
            type="text" 
            bind:value={username}
            class="glass-input"
            placeholder={userType === 'member' ? 'Enter your member username' : 'Enter your organization username'}
          />
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-3">Password</label>
          <input 
            type="password" 
            bind:value={password}
            class="glass-input"
            placeholder="Enter your password"
          />
        </div>

        <button 
          class="glass-button w-full py-3 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
          on:click={handleLogin}
          disabled={loading}
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          {:else}
            Sign In
          {/if}
        </button>

        <div class="text-center pt-4">
          <p class="text-secondary text-sm">
            Don't have an account? 
            <Link to="/register" class="text-primary hover:underline">Register here</Link>
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