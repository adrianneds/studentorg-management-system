<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let membersCommittee = [];
    let ayCommittee = "2023-2024";
    let committee = "";
    let committeeOptions = [];
    let ayInput = "";

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    console.log(username)
    
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
        committeeOptions = membersCommittee.map(o => o.committee).filter(onlyUnique)
    }

    function updateCommittee(value) {
        committee = value;
        getCommittee();
    }

    function updateAY(ayIn) {
        if (!validateAY(ayIn)) {
            return
        }
        ayCommittee = ayIn;
        getCommittee();
    }

    // NEW: import member data from db server
    async function getCommittee() {
      await fetch(`http://localhost:5000/organization/committeeMembers/user/${username}?ay=${ayCommittee}&committee=${committee}`,
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

  onMount(async () => {
    
    if (!$auth || $auth.type !== 'organization') {
        navigate('/login');
        return;
    }

    initFlowbite();
    initializeData();

  });

  
</script>


<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> Committee Members </h1>
        <p class="text-secondary"> Table view of committee members for a given academic year </p>
    </div>

    <div class="mb-8">
    <!-- Dropdown menu -->
    <button id="committeeDropdown" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        {committee!=""?committee : "Committee"}
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        {#each committeeOptions as committee}
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateCommittee(committee)}>{committee}</a>
            </li>
        {/each}
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateCommittee("")}> Any </a>
            </li>
        </ul>
    </div>
    </div>

    <div class = "mb-8">
    <div class="w-full max-w-sm min-w-[200px]">
        <div class="relative">
            <input id = "AYInput" type="email" class="w-full bg-transparent placeholder:text-slate-600 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Academic Year e.g., 2023-2024" bind:value={ayInput} />
            <button id = "AYsubmitButton"
            class="absolute right-1 top-1 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button" on:click={updateAY(ayInput)}
            >
            Submit
            </button>
        </div>
    </div>
    </div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Student Number
                </th>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Committee
                </th>
                <th scope="col" class="px-6 py-3">
                    Role
                </th>
                <th scope="col" class="px-6 py-3">
                    Semester
                </th>
                <th scope="col" class="px-6 py-3">
                    Academic Year
                </th>
            </tr>
        </thead>
        {#each membersCommittee as member}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {member.student_number}
                </th>
                <td class="px-6 py-4">
                    {member.member_name}
                </td>
                <td class="px-6 py-4">
                    {member.committee}
                </td>
                <td class="px-6 py-4">
                    {member.role}
                </td>
                <td class="px-6 py-4">
                    {member.semester}
                </td>
                <td class="px-6 py-4">
                    {member.academic_year}
                </td>
            </tr>
        {/each}
    </table>
</div>

</div>
</div>

<style>
  h1 {
    color: var(--text-primary);
  }
  #committeeDropdown {
    background-color: var(--primary);
  }
    #AYInput {
    background-color: white;
    color:var(--primary)
  }

   #AYsubmitButton {
    background-color: var(--primary);
   }

</style> 