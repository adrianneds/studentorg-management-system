<script>
  import { Link, navigate } from "svelte-routing";
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  
  let userType = 'member';
  let loading = false;
  let error = '';
  let success = false;

  // Member form fields
  let member_query = {
    member_name: '',
    student_number: '',
    gender: '',
    member_password: '',
    degree_program: '',
    member_username: ''
  }

  // Organization form fields
  let org_query = {
    organization_name: '',
    organization_id: '',
    orgainzation_password: '',
    orgnaization_username: ''
  }


  onMount(() => {
    if ($auth) {
      if ($auth.type === 'organization') {
        navigate('/organization-dashboard');
      } else if ($auth.type === 'member') {
        navigate('/member-fees');
      }
    }
  });

  function handleRegister(type) {
    loading = true;
    error = '';
    if (type == 'organization') {
      registerOrg()
    } else if (type == 'member') {
      registerMember()
    }
  }

  // NEW: add organization / register
  async function registerOrg() {
      await fetch(`http://localhost:5001/organization/register`,
      {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(org_query)
      }
      )
      .then(response => {if (!response.ok) 
          {alert("Organization ID or username already exists."); return}
          else {alert("Successfully registered! Please log in..."); success=true; navigate('/login'); response.json()} })
      .then(data => {
      console.log(data);
      }).catch(error => {
      console.log(error);
      return [];
      });
  };

  // NEW: add member / register
  async function registerMember() {
    console.log(member_query)
      await fetch(`http://localhost:5001/member/register`,
      {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(member_query)
      }
      )
      .then(response => {if (!response.ok) 
          {alert("Student number or username already exists."); return}
          else {alert("Successfully registered! Please log in..."); success=true; navigate('/login'); response.json()} })
      .then(data => {
      console.log(data);
      }).catch(error => {
      console.log(error);
      return [];
      });
  };

</script>

<div class="h-[calc(100vh-6rem)] flex items-center justify-center py-4">
  <div class="w-full max-w-4xl px-4">
    <Link to="/home" class="glass-button py-2 px-4 mb-3 inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Home
    </Link>

    <div class="glass-card p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-primary mb-2">Create Account</h1>
        <p class="text-secondary text-sm">Join our community today</p>
      </div>

      {#if error}
        <div class="glass-badge bg-gradient-to-r from-red-500/20 to-pink-500/20 mb-5 p-3 text-center">
          {error}
        </div>
      {/if}

      {#if success}
        <div class="glass-badge bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-5 p-3 text-center">
          Registration successful! Redirecting to login...
        </div>
      {/if}

      <div class="space-y-5 max-h-[calc(85vh-22rem)] overflow-y-auto pr-2">
        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Account Type</label>
          <div class="flex gap-4">
            <button 
              class="flex-1 glass-button py-2.5 {userType === 'member' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' : ''}"
              on:click={() => userType = 'member'}
            >
              Member
            </button>
            <button 
              class="flex-1 glass-button py-2.5 {userType === 'organization' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' : ''}"
              on:click={() => userType = 'organization'}
            >
              Organization
            </button>
          </div>
        </div>

        <form on:submit|preventDefault={()=>handleRegister(userType)}>
        {#if userType === 'member'}
          <div class="space-y-4">
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Full Name</label>
              <input 
                type="text" 
                bind:value={member_query.member_name}
                class="glass-input"
                placeholder="Enter your full name" required
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Username</label>
              <input 
                type="text" 
                bind:value={member_query.member_username}
                class="glass-input"
                placeholder="Choose a username" required
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
              <input 
                type="text" 
                bind:value={member_query.student_number}
                class="glass-input"
                placeholder="Enter your student number" required
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Gender</label>
              <select 
                bind:value={member_query.gender} 
                class="glass-input w-full"
                required
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Degree Program</label>
              <input 
                type="text" 
                bind:value={member_query.degree_program}
                class="glass-input"
                placeholder="Enter your degree program" required
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Password</label>
              <input 
                type="text" 
                bind:value={member_query.member_password}
                class="glass-input"
                placeholder="Create a password" required
              />
            </div>
          </div>
        {:else}
          <div class="space-y-4">
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Organization Name</label>
              <input 
                type="text" 
                bind:value={org_query.organization_name}
                class="glass-input"
                placeholder="Enter organization name" required
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Username</label>
              <input 
                type="text" 
                bind:value={org_query.organization_username}
                class="glass-input"
                placeholder="Choose a username" required
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Organization ID</label>
              <input 
                type="text" 
                bind:value={org_query.organization_id}
                class="glass-input"
                placeholder="Enter organization ID" required
              />
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Password</label>
              <input 
                type="text" 
                bind:value={org_query.organization_password}
                class="glass-input"
                placeholder="Create a password" required
              />
            </div>
          </div>
        {/if}
        <button 
          type = "submit"
          class="glass-button w-full py-2.5 mt-6 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
          disabled={loading}
        >Create Account</button>
        </form>

        <div class="text-center pt-4 pb-2">
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