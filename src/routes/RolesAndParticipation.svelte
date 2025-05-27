<script>
    import { Link } from 'svelte-routing';
    import { onMount, afterUpdate  } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let membersCommittee = [];
    let ayCommittee = "2023-2024"; // default
    let committee = "";
    let committeeOptions = [];
    let ayInput = "";

    let role = "";
    let membersRole = [];
    let roleOptions = [];

    let nsemCount = 3; // default
    let nsemCountInput = 0;
    let statusProps = [];

    let showCommmitee = true;
    let showRoles = false;
    let showStatus = false;

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    console.log(username)

    function resetQuery() {
        ayCommittee = "2023-2024"; // default
        committee = "";
        ayInput = "";
        role = "";
        initializeData ()
    }
    
    function validateAY(ayIn) {
        if ( isNaN(parseInt(ayIn.slice(0,4))) || isNaN(parseInt(ayIn.slice(4,9)))  
        || ayIn[4] != '-' || parseInt(ayIn[3]) != parseInt(ayIn[8]) -1 ) {
        alert("Invalid Academic Year");
        return
    } else {
        return true
    }
    }

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    async function initializeData () {
        await getCommittee();
        await getMemberRoles();
        await getStatusProp();

        committeeOptions = membersCommittee.map(o => o.committee).filter(onlyUnique)
        roleOptions = membersRole.map(o => o.role).filter(onlyUnique)
        console.log(committeeOptions)
        console.log(roleOptions)
    }

    function updateCommittee(value) {
        committee = value;
        getCommittee();
    }

    function updateRole(value) {
        role = value;
        getMemberRoles();
    }


    function updateAY(ayIn) {
        if (!validateAY(ayIn)) {
            return
        }
        ayCommittee = ayIn;
        getCommittee();
    }

    function updatensemCount(nsemCountInput) {
        if (nsemCountInput < 0) {
            alert('Invalid input');
        }
        if (nsemCountInput !== null) {
            nsemCount = nsemCountInput
        }
        getStatusProp();
    }

    // NEW: import member data from db server
    async function getCommittee() {
      await fetch(`http://localhost:5001/organization/committeeMembers/user/${$auth.organization_id}?ay=${ayCommittee}&committee=${committee}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        membersCommittee = data;
        console.log(membersCommittee);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    // NEW: import member data from db server
    async function getStatusProp() {
      await fetch(`http://localhost:5001/organization/memberStatus/user/${$auth.organization_id}?n=${nsemCount}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        statusProps = data;
        console.log(statusProps);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    // NEW: import member data from db server
    async function getMemberRoles() {
      await fetch(`http://localhost:5001/organization/roles/user/${$auth.organization_id}?role=${role}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        membersRole = data;
        console.log(membersRole);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

  onMount(async () => {
    
    if (!$auth || $auth.type !== 'organization') {
        navigate('/login');
        return;
    }

    initFlowbite();
    initializeData();

  });

      afterUpdate(() => {
        initFlowbite();
    });

  
</script>

<div class="options-container">
<div class="options">
    <button class = "glass-button options-button" on:click={() => {showCommmitee=true;showRoles=false;showStatus=false}}>
        Committees
    </button>
    <button class = "glass-button options-button" on:click={() => {showCommmitee=false;showRoles=true;showStatus=false}}>
        Roles
    </button>
    <button class = "glass-button options-button" on:click={() => {showCommmitee=false;showRoles=false;showStatus=true}}>
        Status
    </button>
</div>
</div>



<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">

{#if showCommmitee}
<div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> Committee Members </h1>
        <p class="text-secondary"> Table view of committee members for a given academic year </p>
    </div>

    <div class="committee-options">
    <div class="mb-8">
    <!-- Dropdown menu -->
    <button id="committeeDropdown" data-dropdown-toggle="dropdown-committee"
    class="glass-dropdown" type="button">
        Committee
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="dropdown-committee" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
        {#each committeeOptions as committee}
            <li>
                <a href="#" class="block px-4 py-2" on:click={() => updateCommittee(committee)}>{committee}</a>
            </li>
        {/each}
            <li>
                <a href="#" class="block px-4 py-2" on:click={() => updateCommittee("")}> Any </a>
            </li>
        </ul>
    </div>
    </div>
    
    <div class = "mb-8">
        <div class="flex flex-row">
            <div class="w-full max-w-sm min-w-[200px]">
                <div class="relative">
                    <input id = "AYInput"
                    class="text-input w-full bg-transparent placeholder:text-white text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Academic Year e.g., 2023-2024" bind:value={ayInput} />
                    <button id = "AYsubmitButton"
                    class="text-input-submit absolute right-1 top-1 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button" on:click={updateAY(ayInput)}
                    >
                    Submit
                    </button>
                </div>
            </div>
            <button class = "ml-5 search text-input-submit rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                on:click={() => resetQuery()}>
                    Reset 
            </button>
        </div>
    </div>
    </div>

    <div class="glass-table-container">
    <table class="glass-table">
        <thead>
            <tr>
                <th scope="col">
                    Student Number
                </th>
                <th scope="col">
                    Name
                </th>
                <th scope="col">
                    Committee
                </th>
                <th scope="col">
                    Role
                </th>
                <th scope="col">
                    Semester
                </th>
                <th scope="col">
                    Academic Year
                </th>
            </tr>
        </thead>
        <tbody>
        {#each membersCommittee as member}
            <tr>
                <th scope="row">
                    {member.student_number}
                </th>
                <td>
                    {member.member_name}
                </td>
                <td>
                    {member.committee}
                </td>
                <td>
                    {member.role}
                </td>
                <td>
                    {member.semester}
                </td>
                <td>
                    {member.academic_year}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
</div>
{/if}

<!-- ROLES  -->
{#if showRoles}
<div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
        <a name = "role"> </a>
        <h1 class="text-3xl font-bold text-primary mb-2"> Roles </h1>
        <p class="text-secondary"> Table view of members given selected roles in reverse chronological order </p>
    </div>

    <div class="mb-8 flex flex-row">
    <!-- Dropdown menu -->
    <button id="roleDropdown" data-dropdown-toggle="role-dropdown" class="glass-dropdown" type="button">
        Role
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="role-dropdown" class="dropdown-options z-10 hidden" style="position: absolute; margin-left: 0;">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
        {#each roleOptions as role}
            <li>
                <a href="#" class="block px-4 py-2" on:click={() => updateRole(role)}>{role}</a>
            </li>
        {/each}
            <li>
                <a href="#" class="block px-4 py-2" on:click={() => updateRole("")}> Any </a>
            </li>
        </ul>
    </div>
    <button class = "ml-5 search text-input-submit rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        on:click={() => resetQuery()}>
            Reset 
    </button>
    </div>

    <div class="glass-table-container">
    <table class="glass-table">
        <thead>
            <tr>
                <th scope="col">
                    Student Number
                </th>
                <th scope="col">
                    Name
                </th>
                <th scope="col">
                    Committee
                </th>
                <th scope="col">
                    Role
                </th>
                <th scope="col">
                    Semester
                </th>
                <th scope="col">
                    Academic Year
                </th>
            </tr>
        </thead>
        <tbody>
        {#each membersRole as member}
            <tr>
                <th scope="row">
                    {member.student_number}
                </th>
                <td>
                    {member.member_name}
                </td>
                <td>
                    {member.committee}
                </td>
                <td>
                    {member.role}
                </td>
                <td>
                    {member.semester}
                </td>
                <td>
                    {member.academic_year}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
</div>
{/if}

<!-- MEMBERSHIP STATUS -->
 {#if showStatus}
 <div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> Membership Status throughout the Semesters </h1>
        <p class="text-secondary"> Table view of percentage of active, inactive, miscellaneous status for the last n semesters </p>
    </div>
    
    <div class="mb-8">
        <label for="quantity-input" class="block mb-2 text-sm font-medium text-white-900 dark:text-white"> Show {nsemCountInput} semesters </label>
        <a name="#number-input"> </a>
        <input type="number" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" href="#number-input"
        class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="3" required bind:value={nsemCountInput} on:input={updatensemCount(nsemCountInput)}/>
    </div>

    <div class="glass-table-container">
    <table class="glass-table">
        <thead>
            <tr>
                <th scope="col">
                    Percent Active
                </th>
                <th scope="col">
                    Percent Inactive
                </th>
                <th scope="col">
                    Other
                </th>
                <th scope="col">
                    Semester
                </th>
                <th scope="col">
                    Academic Year
                </th>
            </tr>
        </thead>
        <tbody>
        {#each statusProps as statusProp}
            <tr>
                <td>
                    {statusProp.percent_active}
                </td>
                <td>
                    {statusProp.percent_inactive}
                </td>
                <td>
                    {statusProp.percent_other}
                </td>
                <td>
                    {statusProp.semester}
                </td>
                <td>
                    {statusProp.academic_year}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
    </div>
    </div>

    {/if}

</div>

<style>
  h1 {
    color: var(--text-primary);
  }
   #quantity-input {
    width: 50px;
    height: 30px;
    border-radius:2px;
   }

</style> 