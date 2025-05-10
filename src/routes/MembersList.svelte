<script>
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  import { Dropdown, initFlowbite } from 'flowbite';

    let members = [];
    let memberQuery = {committee:"", role:"", gender:"", degree_program:"", batch:"",membership_status:""} 
    let committees = [];
    let roles = [];
    let degreePrograms = [];
    let batches = [];
    let statuses = [];

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    function filterQuery(key, value) {
        memberQuery[key] = value;
        console.log(memberQuery);
        getMembers();
    }

    async function initializeData () {
        await getMembers();
        committees = members.map(o => o.committee).filter(onlyUnique)
        roles = members.map(o => o['role']).filter(onlyUnique);
        degreePrograms = members.map(o => o['degree_program']).filter(onlyUnique);
        batches = members.map(o => o['batch']).filter(onlyUnique);
        statuses = members.map(o => o['membership_status']).filter(onlyUnique);
    }

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    console.log(username)

    // NEW: import member data from db server
    async function getMembers() {
      await fetch(`http://localhost:5000/organization/orgMembers/user/${username}`,
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(memberQuery)
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
        <h1 class="text-3xl font-bold text-primary mb-2"> Manage Members </h1>
        <p class="text-secondary"> Table view of organization members </p>
    </div>

    <div class="mb-8">
        
    <!-- Dropdown menu -->
    <button id="genderDropdown" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Gender
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('gender','F')}>Female</a>
        </li>
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('gender','M')}>Male</a>
        </li>
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('gender','')}>Any</a>
        </li>
        </ul>
    </div>

    <button id="statusDropdown" data-dropdown-toggle="dropdown2" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Status
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="dropdown2" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        { #each statuses as status}
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('membership_status',status)}>{status}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('membership_status','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="degreeProgramDropdown" data-dropdown-toggle="dropdown3" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Degree Program
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown3" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        { #each degreePrograms as degprog}
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('degree_program',degprog)}>{degprog}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('degree_program','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="committeeDropdown" data-dropdown-toggle="dropdown4" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Committee
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown4" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        { #each committees as committee}
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('committee',committee)}>{committee}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('committee','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="roleDropdown" data-dropdown-toggle="dropdown5" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Role
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown5" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        { #each roles as role}
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('role',role)}>{role}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('role','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="batchDropdown" data-dropdown-toggle="dropdown6" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Batch
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown6" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        { #each batches as batch}
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('batch',batch)}>{batch}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => filterQuery('batch','')}> Any </a>
        </li>
        </ul>
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
                    Gender
                </th>
                <th scope="col" class="px-6 py-3">
                    Degree Program
                </th>
                <th scope="col" class="px-6 py-3">
                    Committee
                </th>
                <th scope="col" class="px-6 py-3">
                    Batch
                </th>
                <th scope="col" class="px-6 py-3">
                    Role
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
            </tr>
        </thead>
        {#each members as member}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {member.student_number}
                </th>
                <td class="px-6 py-4">
                    {member.member_name}
                </td>
                <td class="px-6 py-4">
                    {member.gender}
                </td>
                <td class="px-6 py-4">
                    {member.degree_program}
                </td>
                <td class="px-6 py-4">
                    {member.committee}
                </td>
                <td class="px-6 py-4">
                    {member.batch}
                </td>
                <td class="px-6 py-4">
                    {member.role}
                </td>
                <td class="px-6 py-4">
                    {member.membership_status}
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
  #genderDropdown, #statusDropdown, #degreeProgramDropdown, #committeeDropdown, #roleDropdown, #batchDropdown {
    color: black;
    background-color: var(--text-primary)
  }
</style> 