<script>
  import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  
  export let params = {};
  let organization = null;
  let members = [];
  let selectedMember = null;
  let showMemberModal = false;
  let loading = true;
  let error = null;
  let searchQuery = '';
  let filterStatus = 'all';
  
  onMount(async () => {
    if (!$auth) {
      navigate('/login');
      return;
    }

      // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    console.log(username)

      // NEW: import member data from db server
    async function getMembers() {
      fetch(`http://localhost:5000/organization/orgMembers/user/${username}`,
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({committee:"", role:"",status:"",gender:"",
                            degree_program:"", batch:"", membership_status:""})
      }
      )
      .then(response => response.json())
      .then(data => {
        members = data;
        console.log(members);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    getMembers();

    // Simulate loading organization and members
    setTimeout(() => {
      // If orgId is provided in params, use it to load specific organization
      const orgId = params.orgId || 1;
      
      // organization = {
      //   id: orgId,
      //   name: 'Computer Society',
      //   description: 'A community of computer science enthusiasts',
      //   totalMembers: 150,
      //   activeMembers: 145
      // };

      // members = [
      //   {
      //     id: 1,
      //     name: 'John Doe',
      //     studentNumber: '2024-0001',
      //     role: 'President',
      //     joinDate: '2023-09-01',
      //     status: 'active',
      //     email: 'john.doe@example.com',
      //     contactNumber: '09123456789',
      //     fees: {
      //       paid: 3,
      //       pending: 0,
      //       overdue: 0
      //     }
      //   },
      //   {
      //     id: 2,
      //     name: 'Jane Smith',
      //     studentNumber: '2024-0002',
      //     role: 'Vice President',
      //     joinDate: '2023-09-01',
      //     status: 'active',
      //     email: 'jane.smith@example.com',
      //     contactNumber: '09123456790',
      //     fees: {
      //       paid: 2,
      //       pending: 1,
      //       overdue: 0
      //     }
      //   },
      //   {
      //     id: 3,
      //     name: 'Mike Johnson',
      //     studentNumber: '2024-0003',
      //     role: 'Member',
      //     joinDate: '2024-01-15',
      //     status: 'active',
      //     email: 'mike.johnson@example.com',
      //     contactNumber: '09123456791',
      //     fees: {
      //       paid: 1,
      //       pending: 2,
      //       overdue: 1
      //     }
      //   }
      // ];
      loading = false;
    }, 1000);
  });

  function handleViewMember(member) {
    selectedMember = member;
    showMemberModal = true;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Active':
        return 'from-green-500/20 to-emerald-500/20';
      case 'Inactive':
        return 'from-red-500/20 to-pink-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  }

  // $: filteredMembers = members.filter(member => {
  //   const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                        member.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                        member.role.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
  //   return matchesSearch && matchesStatus;
  // });
</script>

<div class="min-h-[calc(100vh-6rem)] py-8 pb-16 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        {#if $auth.type === 'member'}
          <Link to="/member-dashboard" class="glass-button text-sm py-2 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        {:else}
          <Link to="/organization-dashboard" class="glass-button text-sm py-2 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        {/if}
      </div>
          <br>
      <h1 class="text-3xl font-bold text-primary mb-2">{organization?.name || 'Organization'} Members</h1>
      <p class="text-secondary">View and manage organization members</p>
    </div>

    <div class="flex-1">
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each members as member}
              <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-primary mb-1">{member.member_name}</h3>
                    <p class="text-secondary text-sm">{member.student_number}</p>
                  </div>
                  <div class="glass-badge {member.status === 'active' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'}">
                    {member.role}
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Recent status update:</span>
                    <span class="text-primary">{new Date(member.recent_status_date).toLocaleDateString()}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Batch</span>
                    <span class="text-primary">{member.batch}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Committee</span>
                    <span class="text-primary">{member.committee}</span>
                  </div>
                </div>

                <button 
                  class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                  on:click={() => handleViewMember(member)}
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if showMemberModal && selectedMember}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass-card p-6 max-w-md w-full">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-semibold text-primary">{selectedMember.member_name}</h2>
        <button 
          class="text-secondary hover:text-primary transition-colors"
          on:click={() => {
            showMemberModal = false;
            selectedMember = null;
          }}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
          <p class="text-primary">{selectedMember.student_number}</p>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Status</label>
          <p class="text-primary">{selectedMember.membership_status}</p>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Committee</label>
          <p class="text-primary">{selectedMember.committee}</p>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Role</label>
          <div class="glass-badge inline-block {selectedMember.status === 'active' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'}">
            {selectedMember.role}
          </div>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Gender</label>
          <p class="text-primary">{selectedMember.gender == 'F' ? 'Female' : 'Male'}</p>
        </div>

        <!-- <div>
          <label class="block text-secondary text-sm font-medium mb-2">Fees Status</label>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Paid:</span>
              <span class="text-primary">{selectedMember.fees.paid}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Pending:</span>
              <span class="text-primary">{selectedMember.fees.pending}</span>
            </div>
            {#if selectedMember.fees.overdue > 0}
              <div class="flex justify-between text-sm">
                <span class="text-secondary">Overdue:</span>
                <span class="text-red-500">{selectedMember.fees.overdue}</span>
              </div>
            {/if}
          </div>
        </div> -->
      </div>
    </div>
  </div>
{/if}

<style>
  h1 {
    color: var(--text-primary);
  }
</style>