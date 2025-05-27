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

    let deleteValid = false;
    let updateValid = false;

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

        organization_id: $auth.organization_id,
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
        student_number: '',
        organization_id: $auth.organization_id
    }

    function resetFilterQuery() {
        memberQuery = {student_number:'',  committee:"", role:"", gender:"", degree_program:"", batch:"",membership_status:""} 
        getMembers()
    }

    // NEW: add member
    async function addMember() {
        await fetch(`http://localhost:5001/organization/addMember`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addMemberQuery)
        }
        )
        .then(response => {if (!response.ok) 
            {alert("Something went wrong. Make sure to enter a unique student number and username."); return}
            else {alert("Successfully added member!"); response.json()} })
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    // NEW: update member
    async function updateMember() {
        await fetch(`http://localhost:5001/organization/updateMember`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateMemberQuery)
        }
        )
        .then(response => {if (response.ok && updateValid == true) 
        {alert("Successfully updated member!"); response.json()} })
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    // NEW: delete member
    async function deleteMember() {

        await fetch(`http://localhost:5001/organization/deleteMember`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteMemberQuery)
        }
        )
        .then(response => {if (response.ok && deleteValid == true) 
        {alert("Successfully deleted member!"); response.json()} })
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    async function validateFormInput(query, type) {

        deleteValid = false;
        updateValid = false;

        var success = true;
        var alertText = ""

        if (type == 'add') {
            if (query.academic_year.slice(4,5) != '-' || !isNaN(query.academic_year) || query.academic_year.length != 9)  {
                alertText += "Please enter a valid academic year.\n"
                success = false;
            } 
        }
        if (type == 'update') {
            if (query.member_username=='' && query.member_password== '' &&
                query.member_name==''&&query.gender==''&&query.degree_program=='') {
                success = false;
                alertText += "Please fill out at least one field."
            }
        }
        if (type == 'delete' || type == 'update') {
            let studno = members.find(({ student_number }) => student_number === query.student_number);
            console.log(members)
            console.log(members.find(({ student_number }) => student_number === query.student_number))
            console.log(studno)
            if (studno == undefined) {
                success = false;
                alertText += "Please enter an existing student number.\n"
            }
        }
        if (success == true) {
            deleteValid = true;
            updateValid = true;
            return true;
        } else {
            alert(alertText)
            return false;
        }

    }

    // handle submit for add status update
    async function addMemberSubmit() {
        if (!validateFormInput(addMemberQuery, 'add')) {
            return;
        }
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
        let res = validateFormInput(updateMemberQuery, 'update')
        console.log(res)
        if (!res) {
            return;
        }
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
        let res = validateFormInput(deleteMemberQuery, 'delete')
        console.log(res)
        if (!res) {
            return;
        }
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
      await fetch(`http://localhost:5001/organization/orgMembers/user/${$auth.organization_id}`,
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
    <div class="flex items-center gap-4 mb-2">
        <Link to="/organization-dashboard" class="glass-button text-sm py-2 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
        </Link>
    </div>
    <br><br>
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="cud-header mb-3">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2"> Manage Members </h1>
            <p class="text-secondary"> Add, update, and delete members. See a list view of all members throughout the semesters </p>
        </div>
        <div class="cud-container p-6">
            <div class="cud-options-container flex gap-3">
                <button on:click={()=>{showAddMemberModal=true}} 
                    class="glass-button text-sm h-11 px-4 flex items-center justify-center border border-slate-200 rounded-md" 
                    type="button" data-modal-target="crud-modal" data-modal-toggle="crud-modal">
                    Add Member
                </button>
                <button on:click={()=>{showDeleteMemberModal=true}} 
                    class="glass-button text-sm h-11 px-4 flex items-center justify-center border border-slate-200 rounded-md">
                    Delete Member
                </button>
            </div>
        </div>
    </div>

    <div class="mb-6">
        <div class="flex flex-wrap gap-3">
            <!-- Dropdown menu -->
            <button id="genderDropdown" data-dropdown-toggle="dropdown" 
                class="glass-dropdown h-11 flex items-center justify-between px-4 rounded-md" type="button">
                <span>Gender</span>
                <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
            class="glass-dropdown h-11 flex items-center justify-between px-4 rounded-md" type="button">
                <span>Status</span>
                <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
            class="glass-dropdown h-11 flex items-center justify-between px-4 rounded-md" type="button">
                <span>Degree Program</span>
                <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
            class="glass-dropdown h-11 flex items-center justify-between px-4 rounded-md" type="button">
                <span>Committee</span>
                <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
            class="glass-dropdown h-11 flex items-center justify-between px-4 rounded-md" type="button">
                <span>Role</span>
                <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
            class="glass-dropdown h-11 flex items-center justify-between px-4 rounded-md" type="button">
                <span>Batch</span>
                <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
    </div>

    <div class="mb-6">
        <div class="flex items-center space-x-4">
            <div class="w-full max-w-sm min-w-[200px]">
                <input id = "studno_input"
                class="text-input w-full bg-transparent placeholder:text-white text-sm border border-slate-200 rounded-md px-4 h-11 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Student Num i.e., 2020-04040" bind:value={student_number_input} />
            </div>
            <div class="flex space-x-3">
                <button id = "searchButton"
                class="glass-button text-sm h-11 px-4 min-w-[80px] text-center flex items-center justify-center border border-slate-200 rounded-md"
                type="button" on:click={() => filterQuery('student_number', student_number_input)}
                >
                Search
                </button>
                <button class = "glass-button text-sm h-11 px-4 min-w-[80px] text-center flex items-center justify-center border border-slate-200 rounded-md"
                    on:click={() => resetFilterQuery()}>
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
                    Gender
                </th>
                <th scope="col">
                    Degree Program
                </th>
                <th scope="col">
                    Committee
                </th>
                <th scope="col">
                    Batch
                </th>
                <th scope="col">
                    Role
                </th>
                <th scope="col">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
        {#each members as member}
            <tr>
                <th scope="row">
                    {member.student_number}
                </th>
                <td>
                    {member.member_name}
                </td>
                <td>
                    {member.gender}
                </td>
                <td>
                    {member.degree_program}
                </td>
                <td>
                    {member.committee}
                </td>
                <td>
                    {member.batch}
                </td>
                <td>
                    {member.role}
                </td>
                <td>
                    {member.membership_status}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

</div>
</div>

<!-- Add member modal -->
{#if showAddMemberModal}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    on:click|self={() => showAddMemberModal = false}
  >
    <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
      <div class="flex justify-between items-start p-6 border-b border-white/10">
        <h2 class="text-xl font-semibold text-primary">Add Member</h2>
        <button 
          class="text-secondary hover:text-primary transition-colors"
          on:click={() => {
            showAddMemberModal = false;
          }}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <form id="updateFeeForm" on:submit|preventDefault={()=>addMemberSubmit()}>
          <div class="space-y-4">
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
              <input 
                bind:value={addMemberQuery.student_number}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., 2020-0404"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Username</label>
              <input 
                bind:value={addMemberQuery.member_username}
                type="text"
                class="glass-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Password</label>
              <input 
                bind:value={addMemberQuery.member_password}
                type="text"
                class="glass-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Name</label>
              <input 
                bind:value={addMemberQuery.member_name}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., John Doe"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Gender</label>
              <select 
                bind:value={addMemberQuery.gender}
                class="glass-input w-full"
                required
              >
                <option value="">Select option</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Degree Program</label>
              <input 
                bind:value={addMemberQuery.degree_program}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., BS Statistics"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Organization ID</label>
              <input 
                bind:value={addMemberQuery.organization_id}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., OR-1000"
                disabled
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Committee</label>
              <input 
                bind:value={addMemberQuery.committee}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., Membership"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Batch</label>
              <input 
                bind:value={addMemberQuery.batch}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., 2022B"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Semester</label>
              <select 
                bind:value={addMemberQuery.semester}
                class="glass-input w-full"
                required
              >
                <option value="">Select option</option>
                <option value="1S">1st Semester</option>
                <option value="2S">2nd Semester</option>
                <option value="M">Midyear</option>
              </select>
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Academic Year</label>
              <input 
                bind:value={addMemberQuery.academic_year}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., 2022-2023"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Date of Status Update</label>
              <input 
                bind:value={addMemberQuery.date_of_status_update}
                type="date"
                class="glass-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Role</label>
              <input 
                bind:value={addMemberQuery.role}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., President"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Status</label>
              <input 
                bind:value={addMemberQuery.membership_status}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., Active"
                required
              />
            </div>

            <button 
              type="submit"
              class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Update member modal -->
{#if showUpdateMemberModal}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    on:click|self={() => showUpdateMemberModal = false}
  >
    <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
      <div class="flex justify-between items-start p-6 border-b border-white/10">
        <h2 class="text-xl font-semibold text-primary">Update Member</h2>
        <button 
          class="text-secondary hover:text-primary transition-colors"
          on:click={() => {
            showUpdateMemberModal = false;
          }}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <form id="updateFeeForm" on:submit|preventDefault={()=>updateMemberSubmit()}>
          <div class="space-y-4">
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
              <input 
                bind:value={updateMemberQuery.student_number}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., 2020-0404"
                required
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Username</label>
              <input 
                bind:value={updateMemberQuery.member_username}
                type="text"
                class="glass-input w-full"
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Password</label>
              <input 
                bind:value={updateMemberQuery.member_password}
                type="text"
                class="glass-input w-full"
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Member Name</label>
              <input 
                bind:value={updateMemberQuery.member_name}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., John Doe"
              />
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Gender</label>
              <select 
                bind:value={updateMemberQuery.gender}
                class="glass-input w-full"
              >
                <option value="">Select option</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Degree Program</label>
              <input 
                bind:value={updateMemberQuery.degree_program}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., BS Statistics"
              />
            </div>

            <button 
              type="submit"
              class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Update Member
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Delete member modal -->
{#if showDeleteMemberModal}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    on:click|self={() => showDeleteMemberModal = false}
  >
    <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
      <div class="flex justify-between items-start p-6 border-b border-white/10">
        <h2 class="text-xl font-semibold text-primary">Delete Member</h2>
        <button 
          class="text-secondary hover:text-primary transition-colors"
          on:click={() => {
            showDeleteMemberModal = false;
          }}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <form id="deleteFeeForm" on:submit|preventDefault={()=>deleteMemberSubmit()}>
          <div class="space-y-4">
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
              <input 
                bind:value={deleteMemberQuery.student_number}
                type="text"
                class="glass-input w-full"
                placeholder="i.e., 2020-0404"
                required
              />
            </div>

            <button 
              type="submit"
              class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Member
            </button>
          </div>
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
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-clear-button {
    display: none;
  }
</style> 