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

  // Add coming soon handler
  function handleComingSoon() {
    alert("This feature is coming soon!");
  }

</script>

<div class="h-[calc(100vh-6rem)] p-4 overflow-hidden flex items-center justify-center">
  <div class="max-w-7xl w-full h-[calc(100vh-8rem)] flex flex-col justify-center">
    <!-- Welcome Message -->
    <div class="text-center mb-6">
      <h1 class="text-4xl font-bold text-primary mt-4 mb-2">Welcome, {memberInfo.member_name}</h1>
      <p class="text-secondary text-lg">Manage your profile and organizations</p>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto pr-2">
      <!-- Profile Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <!-- Profile Info -->
        <div class="lg:col-span-2 glass-card p-6">
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 class="text-xl font-semibold text-primary">Personal Information</h2>
              <button 
                class="glass-button text-sm py-2 px-4 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
                on:click={()=>{showUpdateModal=true}}
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                  <p class="text-secondary text-sm mb-1">Student Number</p>
                  <p class="text-primary font-medium text-lg">{memberInfo.student_number}</p>
                </div>
                
                <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                  <p class="text-secondary text-sm mb-1">Username</p>
                  <p class="text-primary font-medium text-lg">{memberInfo.member_username}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                  <p class="text-secondary text-sm mb-1">Degree Program</p>
                  <p class="text-primary font-medium text-lg">{memberInfo.degree_program}</p>
                </div>
                
                <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                  <p class="text-secondary text-sm mb-1">Gender</p>
                  <p class="text-primary font-medium text-lg">{memberInfo.gender == 'F' ? 'Female' : 'Male'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <h2 class="text-xl font-semibold text-primary">Quick Actions</h2>
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="space-y-3">
            <Link 
              to="/member-fees" 
              class="glass-button w-full text-sm py-2.5 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              View Fees
            </Link>

            <button 
              on:click={handleComingSoon}
              class="glass-button w-full text-sm py-2.5 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              My Organizations
            </button>

            <button 
              on:click={handleComingSoon}
              class="glass-button w-full text-sm py-2.5 flex items-center justify-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upcoming Events
            </button>

            <button 
              on:click={handleComingSoon}
              class="glass-button w-full text-sm py-2.5 flex items-center justify-center bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </button>
          </div>
        </div>
      </div>

      <!-- Organizations Section -->
      <div class="glass-card p-6">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-primary">My Organizations</h2>
          <p class="text-secondary">View and manage your organization memberships</p>
        </div>

        {#if loading}
          <div class="flex justify-center items-center h-48">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        {:else if error}
          <div class="glass-badge bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 text-center">
            {error}
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each organizations as org}
              <div class="glass-card p-6 hover:bg-white/5 transition-all duration-200">
                <div class="flex justify-between items-start mb-4">
                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-primary">{org.organization_name}</h3>
                    <p class="text-sm text-secondary">ID: {org.organization_id}</p>
                    <div class="space-y-1">
                      <p class="text-sm text-secondary">Batch {org.batch}</p>
                      <p class="text-sm text-secondary">{org.committee} Committee</p>
                      <p class="text-sm text-secondary">{org.role}</p>
                    </div>
                  </div>
                  <div class="glass-badge px-3 py-1 text-sm">
                    {org.membership_status}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

{#if showUpdateModal}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    on:click|self={() => showUpdateModal = false}
  >
    <div class="glass-card max-w-md w-full max-h-[80vh] flex flex-col">
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
                
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Password</label>
              <input 
                bind:value={updateQuery.member_password}
                type="text"
                class="glass-input w-full"
                
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Name</label>
              <input 
                bind:value={updateQuery.member_name}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., John Doe"
                
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
                
              />
            </div>

            <button 
              type="submit"
              class="glass-button w-full py-2.5 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
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