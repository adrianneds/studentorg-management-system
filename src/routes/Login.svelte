<script>
  import { Link, navigate } from "svelte-routing";
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import Toast from '../components/Toast.svelte';
  
  let username = '';
  let password = '';
  let userType = 'member'; // 'member' or 'organization'
  let loading = false;
  let id = '';
  let studno = '';

  let credentialsValid = false;
  let toastMessage = '';
  let toastType = 'error';
  let showToast = false;

  function showError(message) {
    toastMessage = message;
    toastType = 'error';
    showToast = true;
  }

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
    try {
      const response = await fetch(`http://localhost:5001/organization/getOrganizationId/user/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch organization ID');
      }
      
      const data = await response.json();
      id = data[0].organization_id;
      return id;
    } catch (error) {
      console.error('Error fetching organization ID:', error);
      throw new Error('Failed to fetch organization details');
    }
  }

  async function getStudentNumber(username) {
    try {
      const response = await fetch(`http://localhost:5001/member/getStudentNumber/user/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch student number');
      }
      
      const data = await response.json();
      studno = data[0].student_number;
      return studno;
    } catch (error) {
      console.error('Error fetching student number:', error);
      throw new Error('Failed to fetch member details');
    }
  }

  async function handleLogin() {
    loading = true;
    
    try {
      if (!username || !password) {
        throw new Error('Please fill in all fields');
      }

      if (userType === 'member') {
        credentialsValid = await auth.validateCredentials(username, password, 'member');
        if (credentialsValid) {
          await getStudentNumber(username);
          await auth.login({
            type: 'member',
            member_username: username,
            student_number: studno
          });
          navigate('/member-dashboard');
        } else {
          throw new Error('Invalid member credentials');
        }
      } else {
        credentialsValid = await auth.validateCredentials(username, password, 'organization');
        if (credentialsValid) {
          await getOrganizationId(username);
          await auth.login({
            type: 'organization',
            organization_username: username,
            organization_id: id
          });
          navigate('/organization-dashboard');
        } else {
          throw new Error('Invalid organization credentials');
        }
      }
    } catch (err) {
      showError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      loading = false;
    }
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
            required
            type="text" 
            bind:value={username}
            class="glass-input"
            placeholder={userType === 'member' ? 'Enter your member username' : 'Enter your organization username'}
          />
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-3">Password</label>
          <input 
            required
            type="password" 
            bind:value={password}
            class="glass-input"
            placeholder="Enter your password"
          />
        </div>

        <button 
          class="glass-button w-full py-3 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  </div>
</div>

<Toast 
  bind:show={showToast}
  message={toastMessage}
  type={toastType}
/>

<style>
  h1 {
    color: var(--text-primary);
  }
</style> 