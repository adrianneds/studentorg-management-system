<script>
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  import { Link } from 'svelte-routing';
  
  let organizations = [];
  let memberInfo = {};
  let loading = true;
  let error = null;
  let searchQuery = '';
  let filterStatus = 'all';

  let showUpdateModal = false;
  let updateQuery = {student_number:'', member_username:'', member_password:'', member_name:'',gender:'',degree_program:''};
  
    // NEW: update member
    async function updateMember() {
        await fetch(`http://localhost:5001/member/updateMember`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateQuery)
        }
        )
        .then(response => {if (response.ok) 
            {alert("Successfully updated details!"); response.json()} })
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

      // NEW: get member data from db server
  async function getMemberInfo() {
    fetch(`http://localhost:5001/member/info/user/${$auth.student_number}`)
    .then(response => response.json())
    .then(data => {
      console.log(data[0])
      memberInfo = data[0];
    }).catch(error => {
      console.log(error);
      return [];
    });
  };


  onMount(async () => {
    if (!$auth || $auth.type !== 'member') {
      navigate('/login');
      return;
    }

  // NEW: getting username
  var username = JSON.parse(localStorage.getItem('user')).member_username
  var student_number = JSON.parse(localStorage.getItem('user')).student_number
  console.log(student_number)

  // NEW: get organization data from db server
  async function getOrganizations() {
    fetch(`http://localhost:5001/member/getOrganizations/user/${student_number}`)
    .then(response => response.json())
    .then(data => {
      organizations = data;
    }).catch(error => {
      console.log(error);
      return [];
    });
  };


    // Simulate loading member's organizations
    setTimeout(() => {
      getMemberInfo();
      getOrganizations();
      console.log(memberInfo);
      loading = false;
    }, 500);
  });

    // handle submit for update status update
    async function updateMemberSubmit() {
        updateQuery.student_number = $auth.student_number
        await updateMember();

        // reset query
        updateQuery = {
            student_number: $auth.student_number,
            member_username: '',
            member_password: '',
            member_name: '',
            gender: '',
            degree_program:''
        }

        showUpdateModal = false; 
        getMemberInfo();
    }

</script>

<div class="h-[calc(100vh-6rem)] flex flex-row py-8 px-4 sm:px-6 lg:px-8">

  <!-- NEW: Member information/profile -->

  <div class="dashboard-left-col">

  <div class="flex flex-row gap-20">
    <div class="flex-1 overflow-hidden">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2">Welcome, {memberInfo.member_name} </h1>
            <p class="text-secondary"> Student Number: {memberInfo.student_number} </p>
            <p class="text-secondary"> Degree Program: {memberInfo.degree_program} </p>
            <p class="text-secondary"> Gender: {memberInfo.gender == 'F' ? 'Female' : 'Male'} </p>
        </div>
    </div>

    <div class="glass-card p-6">
          <h2 class="text-xl font-semibold text-primary mb-4">Quick Actions </h2>
          <div class="flex flex-row space-x-3">
              <Link 
              to="/member-fees" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
            >
              View Fees
            </Link>
              <button 
              to="/" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
              on:click={()=>{showUpdateModal=true}}
            >
              Update Personal Details
          </button>
          
          </div>
    </div>

  </div>

    <div class="max-w-7xl mx-auto h-full flex flex-col">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">My Organizations</h1>
        <p class="text-secondary">View and manage your organization memberships</p>
      </div>

      <div class="flex-1 overflow-hidden">
        {#if loading}
          <div class="flex justify-center items-center h-full">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        {:else if error}
          <div class="glass-badge bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 text-center">
            {error}
          </div>
        {:else}
          <div class="h-full overflow-y-auto pr-2">
            <div class="member-home grid grid-cols-1 md:grid-cols-2 gap-2">
              {#each organizations as org}
                <div class="member-organization-card glass-card p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h3 class="text-lg font-semibold text-primary mb-0">{org.organization_name}</h3>
                      <h2 class="text-sm font-semibold text-primary mb-5">{org.organization_id}</h2>
                      <p class="text-secondary text-sm">Batch {org.batch}</p>
                      <p class="text-secondary text-sm">{org.committee} Committee </p>
                      <p class="text-secondary text-sm">{org.role}</p>
                    </div>
                    <div class="glass-badge">
                      {org.membership_status}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
    </div>
  
</div>

{#if showUpdateModal}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    on:click|self={() => showUpdateModal = false}
  >
    <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
      <div class="flex justify-between items-start p-6 border-b border-white/10">
        <h2 class="text-xl font-semibold text-primary">Update Member</h2>
        <button 
          class="text-secondary hover:text-primary transition-colors"
          on:click={() => {
            showUpdateModal = false;
          }}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <form id="updateMemberForm" on:submit|preventDefault={()=>updateMemberSubmit()}>
          <div class="space-y-4">
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Username</label>
              <input 
                bind:value={updateQuery.member_username}
                type="text"
                class="glass-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Password</label>
              <input 
                bind:value={updateQuery.member_password}
                type="text"
                class="glass-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Name</label>
              <input 
                bind:value={updateQuery.member_name}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., John Doe"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Gender</label>
              <select 
                bind:value={updateQuery.gender}
                class="glass-input w-full"
              >
                <option value="">Select option</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Degree Program</label>
              <input 
                bind:value={updateQuery.degree_program}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., BS Statistics"
                required
              />
            </div>

            <button 
              type="submit"
              class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Update Member
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}


<style>
  h1 {
    color: var(--text-primary);
  }
</style> 