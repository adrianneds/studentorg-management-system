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
      fetch(`http://localhost:5001/organization/info/user/${id}`)
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
      fetch(`http://localhost:5001/organization/orgMemberCounts/user/${id}`)
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

<div class="min-h-[calc(100vh-6rem)] p-8">
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Welcome Message -->
    <div class="text-center mb-4">
      <h1 class="text-4xl font-bold text-primary mb-2">{orgInfo?.organization_name || 'Organization'} Dashboard</h1>
      <p class="text-secondary text-lg">Manage your organization, members, and fees</p>
    </div>

    <!-- Organization Info Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Organization Info -->
      <div class="lg:col-span-2 glass-card p-6">
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 class="text-xl font-semibold text-primary">Organization Information</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                <p class="text-secondary text-sm mb-1">Organization ID</p>
                <p class="text-primary font-medium text-lg">{orgInfo?.organization_id || 'OR-9999'}</p>
              </div>
              
              <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                <p class="text-secondary text-sm mb-1">Active Members</p>
                <p class="text-primary font-medium text-lg">{totalActiveMembers || 'N/A'}</p>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                <p class="text-secondary text-sm mb-1">Organization Username</p>
                <p class="text-primary font-medium text-lg">{orgInfo?.organization_username || 'N/A'}</p>
              </div>
              
              <div class="glass-badge bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
                <p class="text-secondary text-sm mb-1">Total Members</p>
                <p class="text-primary font-medium text-lg">{totalMembers || 'N/A'}</p>
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
            to="/members" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            View Members (Card)
          </Link>

          <Link 
            to="/members-list" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            View Members (List)
          </Link>

          <Link 
            to="/fees" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Manage Fees
          </Link>
        </div>
      </div>
    </div>

    <!-- Management Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Member Management -->
      <div class="glass-card p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-primary">Member Management</h2>
          <p class="text-secondary">Manage member details and status</p>
        </div>
        <div class="space-y-3">
          <Link 
            to="/alumni" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Alumni
          </Link>

          <Link 
            to="/roles-and-participation" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Roles and Participation
          </Link>

          <Link 
            to="/status-updates" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Manage Status Updates
          </Link>
        </div>
      </div>

      <!-- Fee Management -->
      <div class="glass-card p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-primary">Fee Management</h2>
          <p class="text-secondary">Manage fees and transactions</p>
        </div>
        <div class="space-y-3">
          <Link 
            to="/fees" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Manage Fees
          </Link>

          <Link 
            to="/transactions" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Manage Transactions
          </Link>

          <Link 
            to="/organization-fee-members" 
            class="glass-button w-full text-sm py-3 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
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

<style>
  h1 {
    color: var(--text-primary);
  }
</style> 