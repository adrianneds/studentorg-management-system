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
  
  onMount(async () => {
    if (!$auth || $auth.type !== 'member') {
      navigate('/login');
      return;
    }

  // NEW: getting username
  var username = JSON.parse(localStorage.getItem('user')).member_username
  var student_number = JSON.parse(localStorage.getItem('user')).student_number
  console.log(student_number)

  // NEW: get member data from db server
  async function getMemberInfo() {
    fetch(`http://localhost:5000/member/info/user/${username}`)
    .then(response => response.json())
    .then(data => {
      console.log(data[0])
      memberInfo = data[0];
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

  // NEW: get organization data from db server
  async function getOrganizations() {
    fetch(`http://localhost:5000/member/getOrganizations/user/${student_number}`)
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
      // organizations = [
      //   {
      //     id: 1,
      //     name: 'Computer Society',
      //     description: 'A community of computer science enthusiasts',
      //     role: 'Member',
      //     joinDate: '2024-01-15',
      //     fees: {
      //       total: 3,
      //       paid: 2,
      //       pending: 1,
      //       overdue: 0
      //     },
      //     status: 'active',
      //     members: 150
      //   },
      //   {
      //     id: 2,
      //     name: 'Math Club',
      //     description: 'Exploring the beauty of mathematics',
      //     role: 'Officer',
      //     joinDate: '2024-02-01',
      //     fees: {
      //       total: 2,
      //       paid: 2,
      //       pending: 0,
      //       overdue: 0
      //     },
      //     status: 'active',
      //     members: 80
      //   }
      // ];
      loading = false;
    }, 1000);
  });

  // $: filteredOrganizations = organizations.filter(org => {
  //   const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                        org.description.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesStatus = filterStatus === 'all' || org.status === filterStatus;
  //   return matchesSearch && matchesStatus;
  // });
</script>

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">

<!-- NEW: Member information/profile -->
<div class="flex-1 overflow-hidden">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Welcome, {memberInfo.member_name} </h1>
        <p class="text-secondary"> Student Number: {memberInfo.student_number} </p>
        <p class="text-secondary"> Degree Program: {memberInfo.degree_program} </p>
        <p class="text-secondary"> Gender: {memberInfo.gender == 'F' ? 'Female' : 'Male'} </p>
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

                <div class="grid grid-cols-2 gap-2">

                  <Link 
                    to="/member-fees/{org.id}" 
                    class="member-home glass-button text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Fees
                  </Link>

                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  h1 {
    color: var(--text-primary);
  }
</style> 