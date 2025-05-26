<script>
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  import { Dropdown, initFlowbite } from 'flowbite';

    let members = [];
    let memberQuery = {student_number:'',  committee:"", role:"", gender:"", degree_program:"", batch:"",membership_status:""} 
    let committees = [];
    let roles = [];
    let degreePrograms = [];
    let batches = [];
    let statuses = [];
    let student_number_input = ""

    let showAddMemberModal = false;
    let showUpdateMemberModal = false;
    let showDeleteMemberModal = false;

    let addMemberQuery = {
        student_number: '',
        member_username: '',
        member_password: '',
        member_name: '',
        gender: '',
        degree_program:'',

        organization_id: id,
        committee: '',
        batch: '',
        semester: '',
        academic_year: '',
        date_of_status_update: '',
        role: '',
        membership_status: ''
    }

    let updateMemberQuery = {
        student_number: '',
        member_username: '',
        member_password: '',
        member_name: '',
        gender: '',
        degree_program:''
    }

    let deleteMemberQuery = {
        student_number: ''
    }

    function resetFilterQuery() {
        memberQuery = {student_number:'',  committee:"", role:"", gender:"", degree_program:"", batch:"",membership_status:""} 
        getMembers()
    }

    // NEW: add member
    async function addMember() {
        await fetch(`http://localhost:5000/organization/addMember`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addMemberQuery)
        }
        )
        .then(response => response.json())
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    // NEW: update member
    async function updateMember() {
        await fetch(`http://localhost:5000/organization/updateMember`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateMemberQuery)
        }
        )
        .then(response => response.json())
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    // NEW: delete member
    async function deleteMember() {

        await fetch(`http://localhost:5000/organization/deleteMember`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteMemberQuery)
        }
        )
        .then(response => response.json())
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };


    // handle submit for add status update
    async function addMemberSubmit() {
        addMemberQuery.organization_id = id
        await addMember();

        // reset query
        addMemberQuery = {
            student_number: '',
            member_username: '',
            member_password: '',
            member_name: '',
            gender: '',
            degree_program:'',

            organization_id: id,
            committee: '',
            batch: '',
            semester: '',
            academic_year: '',
            date_of_status_update: '',
            role: '',
            membership_status: ''
        }

        showAddMemberModal = false; 
        getMembers();
    }

    // handle submit for update status update
    async function updateMemberSubmit() {
        updateMemberQuery.organization_id = id
        await updateMember();

        // reset query
        updateMemberQuery = {
            student_number: '',
            member_username: '',
            member_password: '',
            member_name: '',
            gender: '',
            degree_program:''
        }

        showUpdateMemberModal = false; 
        getMembers();
    }

    // handle submit for delete status update
    async function deleteMemberSubmit() {
        deleteMemberQuery.organization_id = id
        await deleteMember();

        // reset query
        deleteMemberQuery = {
            student_number: ''
        }

        showDeleteMemberModal = false; 
        getMembers();
    }

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
    var id = JSON.parse(localStorage.getItem('user')).organization_id
    console.log(username)

    // NEW: import member data from db server
    async function getMembers() {
      await fetch(`http://localhost:5000/organization/orgMembers/user/${$auth.organization_id}`,
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

    <Link to="/organization-dashboard" class="back-to-dashboard glass-button text-sm py-2 flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
    </Link>
    <br><br>
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="cud-header mb-3">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2"> Manage Members </h1>
            <p class="text-secondary"> Add, update, and delete members. See a list view of all members throughout the semesters </p>
        </div>
        <div class="cud-container p-6">
            <div class="cud-options-container">
                <button on:click={()=>{showAddMemberModal=true}} class="glass-button text-sm py-2 flex items-center" type="button" data-modal-target="crud-modal" data-modal-toggle="crud-modal">
                Add Member
                </button> <br>
                <button on:click={()=>{showUpdateMemberModal=true}} class="glass-button text-sm py-2 flex items-center">
                Update Member
                </button>
                <br>
                <button on:click={()=>{showDeleteMemberModal=true}} class="glass-button text-sm py-2 flex items-center">
                Delete Member
                </button>
            </div>
        </div>
    </div>

    <div class="mb-8">
        
    <!-- Dropdown menu -->
    <button id="genderDropdown" data-dropdown-toggle="dropdown" 
        class= "glass-dropdown" type="button">
            Gender
        <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
    </button>
        <div id="dropdown" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('gender','F')}>Female</a>
        </li>
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('gender','M')}>Male</a>
        </li>
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('gender','')}>Any</a>
        </li>
        </ul>
    </div>

    <button id="statusDropdown" data-dropdown-toggle="dropdown2"
    class="glass-dropdown" type="button">
        Status
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown2" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
        { #each statuses as status}
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('membership_status',status)}>{status}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('membership_status','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="degreeProgramDropdown" data-dropdown-toggle="dropdown3"
    class="glass-dropdown" type="button">
        Degree Program
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown3" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm w-40" aria-labelledby="dropdownDefaultButton">
        { #each degreePrograms as degprog}
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('degree_program',degprog)}>{degprog}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('degree_program','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="committeeDropdown" data-dropdown-toggle="dropdown4"
    class="glass-dropdown" type="button">
        Committee
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown4" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
        { #each committees as committee}
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('committee',committee)}>{committee}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('committee','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="roleDropdown" data-dropdown-toggle="dropdown5"
    class="glass-dropdown" type="button">
        Role
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown5" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
        { #each roles as role}
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('role',role)}>{role}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('role','')}> Any </a>
        </li>
        </ul>
    </div>

    <button id="batchDropdown" data-dropdown-toggle="dropdown6"
    class="glass-dropdown" type="button">
        Batch
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
        <div id="dropdown6" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
        { #each batches as batch}
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('batch',batch)}>{batch}</a>
        </li>
        { /each }
        <li>
            <a href="#" class="block px-4 py-2" on:click={() => filterQuery('batch','')}> Any </a>
        </li>
        </ul>
    </div>
    </div>

    <div class = "mb-8">
        <div class="w-full max-w-sm min-w-[200px]">
            <div class="flex flex-row relative">
                <input id = "studno_input" type="email" class="text-input w-full bg-transparent placeholder:text-white text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Student Num i.e., 2020-04040" bind:value={student_number_input}/>
                <button id = "studno_input"
                class="ml-2 search text-input-submit rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button" on:click={() => filterQuery('student_number',student_number_input)}
                >
                Search
                </button>
                <button class = "search text-input-submit rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                on:click={() => resetFilterQuery()}>
                    Reset 
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

<!-- Add member modal -->
{#if showAddMemberModal}
<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="add-member glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Add Member
                </h3>
                <button on:click={()=>{showAddMemberModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "updateFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>addMemberSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Number</label>
                        <input bind:value={addMemberQuery.student_number} type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., 2020-0404" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Username</label>
                        <input bind:value={addMemberQuery.member_username} type="text" name="member_username" id="member_username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Password</label>
                        <input bind:value={addMemberQuery.member_password} type="text" name="member_password" id="member_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Name</label>
                        <input bind:value={addMemberQuery.member_name} type="text" name="member_name" id="member_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., John Doe" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                        <select bind:value={addMemberQuery.gender} id="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label for="degree_program" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Program</label>
                        <input bind:value={addMemberQuery.degree_program} type="text" name="degree_program" id="degree_program" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., BS Statistics" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="organization_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization ID</label>
                        <input bind:value={addMemberQuery.organization_id} type="text" name="organization_id" id="organization_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Membership Fee" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="committee" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Committee</label>
                        <input bind:value={addMemberQuery.committee} type="text" name="committee" id="committee" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., Membership" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="batch" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Batch</label>
                        <input bind:value={addMemberQuery.batch} type="text" name="batch" id="batch" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., 2022B" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester</label>
                        <select bind:value={addMemberQuery.semester} id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="academic_year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Academic Year</label>
                        <input bind:value={addMemberQuery.academic_year} type="text" name="academic_year" id="academic_year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., 2022-2023" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="date_of_status_update" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Status Update</label>
                        <input bind:value={addMemberQuery.date_of_status_update} type="date" name="date_of_status_update" id="date_of_status_update" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                        <input bind:value={addMemberQuery.role} type="text" name="role" id="role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., President" required="">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="membership_status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <input bind:value={addMemberQuery.membership_status} type="text" name="membership_status" id="membership_status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Active" required="">
                    </div>
                </div>
                <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    Add
                </button>
            </form>
        </div>
    </div>
</div>
{/if}

<!-- Add member modal -->
{#if showUpdateMemberModal}
<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Update Member
                </h3>
                <button on:click={()=>{showUpdateMemberModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Number</label>
                        <input bind:value={updateMemberQuery.student_number} type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., 2020-0404" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Username</label>
                        <input bind:value={updateMemberQuery.member_username} type="text" name="member_username" id="member_username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Password</label>
                        <input bind:value={updateMemberQuery.member_password} type="text" name="member_password" id="member_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="member_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Member Name</label>
                        <input bind:value={updateMemberQuery.member_name} type="text" name="member_name" id="member_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., John Doe" required="">
                    </div>
                    <div class="col-span-2">
                        <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                        <select bind:value={updateMemberQuery.gender} id="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label for="degree_program" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Program</label>
                        <input bind:value={updateMemberQuery.degree_program} type="text" name="degree_program" id="degree_program" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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

<!-- Delete status update modal -->
{#if showDeleteMemberModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Member
                </h3>
                <button on:click={()=>{showDeleteMemberModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "deleteFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>deleteMemberSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Student Number </label>
                        <input bind:value={deleteMemberQuery.student_number} type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2020-0404" required="">
                    </div>
                <button type="submit" class="w-20 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Delete
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
  table {
    color: black;
  }
</style> 