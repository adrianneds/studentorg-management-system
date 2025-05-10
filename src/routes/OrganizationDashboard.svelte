<script>
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  
  let organization = null;
  let loading = true;
  let error = null;
  let orgInfo = [];
  
  onMount(async () => {
    if (!$auth || $auth.type !== 'organization') {
      navigate('/login');
      return;
    }

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username

    // NEW: import org data from db server
    async function getOrganizationInfo() {
      fetch(`http://localhost:5000/organization/info/user/${username}`)
      .then(response => response.json())
      .then(data => {
        console.log(data[0])
        orgInfo = data[0];
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    getOrganizationInfo()
    console.log(orgInfo)

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
      <p class="text-secondary">Manage your organization and members</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- NEW: for organization info -->
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1"> Orgniazation ID </div>
        <div class="text-2xl font-semibold text-primary">{orgInfo?.organization_id || 0}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Total Members</div>
        <div class="text-2xl font-semibold text-primary">{organization?.totalMembers || 0}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Active Members</div>
        <div class="text-2xl font-semibold text-primary">{organization?.activeMembers || 0}</div>
      </div>
      <!-- <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Officers</div>
        <div class="text-2xl font-semibold text-primary">{organization?.officers || 0}</div>
      </div> -->

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="glass-card p-6">
          <h2 class="text-xl font-semibold text-primary mb-4">Organization Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Description</label>
              <p class="text-primary">{organization?.description}</p>
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Established</label>
              <p class="text-primary">{new Date(organization?.established).toLocaleDateString()}</p>
            </div>
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Committees</label>
              <div class="flex flex-wrap gap-2">
                {#each organization?.committees || [] as committee}
                  <div class="glass-badge bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                    {committee}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="glass-card p-6">
          <h2 class="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
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
              to="/members" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Members
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

            <Link 
              to="/roles-and-participation" 
              class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Roles and Participation
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