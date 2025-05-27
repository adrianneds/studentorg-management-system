<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let statusUpdates = [];

    let showAddStatusUpdateModal = false;
    let showUpdateStatusUpdateModal = false;
    let showDeleteStatusUpdateModal = false;

    let deleteValid = false;
    let updateValid = false;

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    var id = JSON.parse(localStorage.getItem('user')).organization_id
    console.log(username)

    let addStatusUpdateQuery = {
        student_number: '',
        organization_id: id,
        committee: '',
        batch: '',
        semester: '',
        academic_year: '',
        date_of_status_update: '',
        role: '',
        membership_status: ''
    };

    let updateStatusUpdateQuery = {
        student_number: '',
        organization_id: id,
        committee: '',
        batch: '',
        semester: '',
        academic_year: '',
        date_of_status_update: '',
        role: '',
        membership_status: '' 
    }

    let deleteStatusUpdateQuery = {
        semester: '',
        academic_year: '',
        student_number: '',
        organization_id: id
    }

    async function validateFormInput(query, type) {

        deleteValid = false;
        updateValid = false;

        var success = true;
        var alertText = ""

        if (query.academic_year.slice(4,5) != '-' || !isNaN(query.academic_year) || query.academic_year.length != 9)  {
            alertText += "Please enter a valid academic year.\n"
            success = false;
        } 

        if (type =='update') {
            if (query.committee== '' && query.batch==''&&query.semester==''&&query.academic_year==''
                &&query.date_of_status_update==''&&query.role==''&&query.membership_status=='') {
                success = false;
                alertText += "Please fill out at least one field."
            }
        }

        if (type =='update' || type == 'delete') {
            let studno = statusUpdates.find(({ student_number }) => student_number === query.student_number);
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

    // NEW: add status update
    async function addStatusUpdate() {
        await fetch(`http://localhost:5000/organization/addStatusUpdate`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addStatusUpdateQuery)
        }
        )
        .then(response => {if (!response.ok) 
            {alert("Something went wrong. Make sure to enter only one status update per student per semester."); return}
            else {alert("Successfully added status update!"); response.json()} })
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    // NEW: update status update
    async function updateStatusUpdate() {
        await fetch(`http://localhost:5000/organization/updateStatusUpdate`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateStatusUpdateQuery)
        }
        )
        .then(response => {if (response.ok && updateValid == true) 
        {alert("Successfully changed status update!"); response.json()} })
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    // NEW: delete status update
    async function deleteStatusUpdate() {

        await fetch(`http://localhost:5000/organization/deleteStatusUpdate`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteStatusUpdateQuery)
        }
        )
        .then(response => {if (response.ok && deleteValid == true) 
        {alert("Successfully deleted status update!"); response.json()} })
        .then(data => {
        console.log(data);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };

    // handle submit for add status update
    async function addStatusUpdateSubmit() {
        if (!validateFormInput(addStatusUpdateQuery, 'add')) {
            return;
        }
        addStatusUpdateQuery.organization_id = id
        await addStatusUpdate();

        // reset query
        addStatusUpdateQuery = {
            student_number: '',
            organization_id: id,
            committee: '',
            batch: '',
            semester: '',
            academic_year: '',
            date_of_status_update: '',
            role: '',
            membership_status: ''
        };

        showAddStatusUpdateModal = false; 
        getStatusUpdates();
    }

    // handle submit for update status update
    async function updateStatusUpdateSubmit() {
        if (!validateFormInput(updateStatusUpdateQuery, 'update')) {
            return;
        }
        updateStatusUpdateQuery.organization_id = id
        await updateStatusUpdate();

        // reset query
        updateStatusUpdateQuery = {
            student_number: '',
            organization_id: id,
            committee: '',
            batch: '',
            semester: '',
            academic_year: '',
            date_of_status_update: '',
            role: '',
            membership_status: ''
        };

        showUpdateStatusUpdateModal = false; 
        getStatusUpdates();
    }

    // handle submit for delete status update
    async function deleteStatusUpdateSubmit() {
        if (!validateFormInput(deleteStatusUpdateQuery, 'delete')) {
            return;
        }
        deleteStatusUpdateQuery.organization_id = id
        await deleteStatusUpdate();

        // reset query
        deleteStatusUpdateQuery = {
            semester: '',
            academic_year: '',
            student_number: '',
            organization_id: id
        }

        showDeleteStatusUpdateModal = false; 
        getStatusUpdates();
    }

    // NEW: import member with late payments from db server
    async function getStatusUpdates() {
      await fetch(`http://localhost:5000/organization/viewStatusUpdates/user/${$auth.organization_id}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        statusUpdates = data;
        console.log(statusUpdates);
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
        getStatusUpdates();
    });

</script> 

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="cud-header mb-8">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2"> Status Updates </h1>
            <p class="text-secondary"> Manage all status updates from organization members </p>
        </div>
        <div class="cud-container p-6">
            <div class="cud-options-container">
                <button on:click={()=>{showAddStatusUpdateModal=true}} class="glass-button text-sm py-2 flex items-center" type="button" data-modal-target="crud-modal" data-modal-toggle="crud-modal">
                Add Status Update
                </button> <br>
                <button on:click={()=>{showUpdateStatusUpdateModal=true}} class="glass-button text-sm py-2 flex items-center">
                Change Status Update
                </button>
                <br>
                <button on:click={()=>{showDeleteStatusUpdateModal=true}} class="glass-button text-sm py-2 flex items-center">
                Delete Status Update
                </button>
            </div>
        </div>
    </div>

    <!-- `SELECT student_number, committee, batch, semester,
    academic_year, date_of_status_update, role, membership_status FROM is_part_of 
    NATURAL JOIN organization WHERE organization_username = '${user}';` -->

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
                    Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Sem/AY
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
        {#each statusUpdates as row}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {row.student_number}
                </th>
                <td class="px-6 py-4">
                    {row.member_name}
                </td>
                <td class="px-6 py-4">
                    {row.date_of_status_update.slice(0,10)}
                </td>
                <td class="px-6 py-4">
                    {row.semester}/{row.academic_year}
                </td>
                <td class="px-6 py-4">
                    {row.committee}
                </td>
                <td class="px-6 py-4">
                    {row.batch}
                </td>
                <td class="px-6 py-4">
                    {row.role}
                </td>
                <td class="px-6 py-4">
                    {row.membership_status}
                </td>
            </tr>
        {/each}
    </table>
</div>
</div>

<!-- Add transaction modal -->
{#if showAddStatusUpdateModal}
<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Add Status Update
                </h3>
                <button on:click={()=>{showAddStatusUpdateModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "updateFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>addStatusUpdateSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Number</label>
                        <input bind:value={addStatusUpdateQuery.student_number} type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., 2020-0404" required>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="organization_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization ID</label>
                        <input bind:value={addStatusUpdateQuery.organization_id} disabled required type="text" name="organization_id" id="organization_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Membership Fee">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="committee" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Committee</label>
                        <input bind:value={addStatusUpdateQuery.committee} type="text" name="committee" id="committee" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., Membership" required>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="batch" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Batch</label>
                        <input bind:value={addStatusUpdateQuery.batch} type="text" name="batch" id="batch" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., 2022B" required>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester</label>
                        <select bind:value={addStatusUpdateQuery.semester} required id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="academic_year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Academic Year</label>
                        <input bind:value={addStatusUpdateQuery.academic_year} type="text" name="academic_year" id="academic_year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="i.e., 2022-2023" required>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="date_of_status_update" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Status Update</label>
                        <input bind:value={addStatusUpdateQuery.date_of_status_update} required type="date" name="date_of_status_update" id="date_of_status_update" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                        <input bind:value={addStatusUpdateQuery.role} required type="text" name="role" id="role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., President">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="membership_status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <input bind:value={addStatusUpdateQuery.membership_status} required type="text" name="membership_status" id="membership_status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Active">
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

<!-- Update modal -->
{#if showUpdateStatusUpdateModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Change Status Update
                </h3>
                <button on:click={()=>{showUpdateStatusUpdateModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "updateFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>updateStatusUpdateSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Number</label>
                        <input bind:value={updateStatusUpdateQuery.student_number} required type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2020-0404">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="organization_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization ID</label>
                        <input bind:value={updateStatusUpdateQuery.organization_id} disabled type="text" name="organization_id" id="organization_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Membership Fee">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="committee" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Committee</label>
                        <input bind:value={updateStatusUpdateQuery.committee} type="text" name="committee" id="committee" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Membership">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="batch" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Batch</label>
                        <input bind:value={updateStatusUpdateQuery.batch} type="text" name="batch" id="batch" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022B">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester</label>
                        <select bind:value={updateStatusUpdateQuery.semester} id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="academic_year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Academic Year</label>
                        <input bind:value={updateStatusUpdateQuery.academic_year} type="text" name="academic_year" id="academic_year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="date_of_status_update" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Status Update</label>
                        <input bind:value={updateStatusUpdateQuery.date_of_status_update} type="date" name="date_of_status_update" id="date_of_status_update" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                        <input bind:value={updateStatusUpdateQuery.role} type="text" name="role" id="role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., President">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="membership_status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <input bind:value={updateStatusUpdateQuery.membership_status} type="text" name="membership_status" id="membership_status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Active">
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
{#if showDeleteStatusUpdateModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Status Update
                </h3>
                <button on:click={()=>{showDeleteStatusUpdateModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "deleteFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>deleteStatusUpdateSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester</label>
                        <select bind:value={deleteStatusUpdateQuery.semester} required id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label for="academic_year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Academic Year </label>
                        <input bind:value={deleteStatusUpdateQuery.academic_year} required type="text" name="academic_year" id="academic_year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
                    </div>
                    <div class="col-span-2">
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Number</label>
                        <input bind:value={deleteStatusUpdateQuery.student_number} required type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2020-0404">
                    </div>
                    <div class="col-span-2">
                        <label for="organization_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization ID</label>
                        <input bind:value={deleteStatusUpdateQuery.organization_id} disabled required type="text" name="organization_id" id="organization_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., FE-10000">
                    </div>
                <button type="submit" class="w-20 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Delete
                </button>
            </form>
        </div>
    </div>
</div> 

{/if}

</div>