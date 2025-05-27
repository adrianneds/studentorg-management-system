<script>
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  
  let organization = null;
  let loading = true;
  let error = null;
  let orgInfo = [];

  let totalMembers = null;
  let totalActiveMembers = null;
  
  onMount(async () => {
    if (!$auth || $auth.type !== 'organization') {
      navigate('/login');
      return;
    }

    console.log($auth)

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    var id =  JSON.parse(localStorage.getItem('user')).organization_id

    // NEW: import org data from db server
    async function getOrganizationInfo() {
      fetch(`http://localhost:5000/organization/info/user/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data[0])
        orgInfo = data[0];
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    // NEW: import member data from db server
    async function getMemberCounts() {
      fetch(`http://localhost:5000/organization/orgMemberCounts/user/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        totalMembers = data[0].count_total;
        totalActiveMembers = data[0].count_active;
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    await getOrganizationInfo()
    await getMemberCounts()
    console.log(orgInfo)
    console.log(totalMembers)
    console.log(totalActiveMembers)

    // Simulate loading organization
    // setTimeout(() => {
    //   organization = {
    //     id: 1,
    //     name: 'Computer Society',
    //     description: 'A community of computer science enthusiasts',
    //     established: '2020-01-01',
    //     totalMembers: 150,
    //     activeMembers: 145,
    //     officers: 10,
    //     committees: ['Technical', 'Events', 'Marketing', 'Finance']
    //   };
    //   loading = false;
    // }, 1000);
  });
</script>

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary mb-2">{orgInfo?.organization_name || 'Organization'} Dashboard</h1>
      <p class="text-secondary">Manage your organization, members, and fees </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- NEW: for organization info -->
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1"> Orgniazation ID </div>
        <div class="text-2xl font-semibold text-primary">{orgInfo?.organization_id || 'OR-9999'}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Total Members</div>
        <div class="text-2xl font-semibold text-primary">{totalMembers || 999}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Active Members</div>
        <div class="text-2xl font-semibold text-primary">{totalActiveMembers || 999}</div>
      </div>
      <!-- <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Officers</div>
        <div class="text-2xl font-semibold text-primary">{organization?.officers || 0}</div>
      </div> -->

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="glass-card p-6">
          <h2 class="text-xl font-semibold text-primary mb-4">View Members</h2>
          <div class="space-y-4">
              <Link 
              to="/members" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Members (Card View)
            </Link>
            <Link 
              to="/members-list" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Members (List View)
            </Link>
          </div>
        </div>

      </div>
        
      <div class="glass-card p-6">
        <div class="space-y-3">
          <h2 class="text-xl font-semibold text-primary mb-4"> Member Details </h2>
            
            <Link 
              to="/alumni" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Alumni
            </Link>

            <Link 
              to="/roles-and-participation" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Roles and Participation
            </Link>

            <Link 
              to="/status-updates" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Status Updates
            </Link>
      </div>
      </div>

      <div>
        <div class="glass-card p-6">
          <h2 class="text-xl font-semibold text-primary mb-4">Fees</h2>
          <div class="space-y-3">
            <Link 
              to="/fees" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Manage Fees
            </Link>
            
            <Link 
                to="/transactions" 
                class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Manage Transactions
            </Link>

              <Link 
                  to="/organization-fee-members" 
                  class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pending Members
            </Link>

          </div>
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