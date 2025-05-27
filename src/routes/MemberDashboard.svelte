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

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Update Member
                </h3>
                <button on:click={()=>{showUpdateModal=false}} type="button" class="glass-button text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "updateFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>updateMemberSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="member_username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Username</label>
                        <input bind:value={updateQuery.member_username} type="text" name="member_username" id="member_username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Password</label>
                        <input bind:value={updateQuery.member_password} type="text" name="member_password" id="member_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Name</label>
                        <input bind:value={updateQuery.member_name} type="text" name="member_name" id="member_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., John Doe" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                        <select bind:value={updateQuery.gender} id="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label for="degree_program" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Program</label>
                        <input bind:value={updateQuery.degree_program} type="text" name="degree_program" id="degree_program" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., BS Statistics" required="">
                    </div>
                </div>
                <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    Update
                </button>
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