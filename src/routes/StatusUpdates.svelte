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
                alertText += "Please fill out at least one field.\n"
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
        await fetch(`http://localhost:5001/organization/addStatusUpdate`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addStatusUpdateQuery)
        }
        )
        .then(response => {if (!response.ok) 
            {alert("Something went wrong. Make sure to:\n Enter only one status update per student per semester\nEnter an existing student number"); return}
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
        await fetch(`http://localhost:5001/organization/updateStatusUpdate`,
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

        await fetch(`http://localhost:5001/organization/deleteStatusUpdate`,
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
      await fetch(`http://localhost:5001/organization/viewStatusUpdates/user/${$auth.organization_id}`,
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

<style>
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-clear-button {
    display: none;
  }
</style>

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-4 mb-2">
        <Link to="/organization-dashboard" class="glass-button text-sm py-2 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
        </Link>
    </div>
    <br>
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

        <div class="glass-table-container">
        <table class="glass-table">
            <thead>
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
            <tbody>
            {#each statusUpdates as row}
                <tr>
                    <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
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
            </tbody>
        </table>
    </div>
    </div>

    <!-- Add status update modal -->
    {#if showAddStatusUpdateModal}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        on:click|self={() => showAddStatusUpdateModal = false}
      >
        <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
          <div class="flex justify-between items-start p-6 border-b border-white/10">
            <h2 class="text-xl font-semibold text-primary">Add Status Update</h2>
            <button 
              class="text-secondary hover:text-primary transition-colors"
              on:click={() => {
                showAddStatusUpdateModal = false;
              }}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <form id="updateFeeForm" on:submit|preventDefault={()=>addStatusUpdateSubmit()}>
              <div class="space-y-4">
                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
                  <input 
                    bind:value={addStatusUpdateQuery.student_number}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2020-0404"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Organization ID</label>
                  <input 
                    bind:value={addStatusUpdateQuery.organization_id}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., Membership Fee"
                    disabled
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Committee</label>
                  <input 
                    bind:value={addStatusUpdateQuery.committee}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., Membership"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Batch</label>
                  <input 
                    bind:value={addStatusUpdateQuery.batch}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2022B"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Semester</label>
                  <select 
                    bind:value={addStatusUpdateQuery.semester}
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
                    bind:value={addStatusUpdateQuery.academic_year}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2022-2023"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Date of Status Update</label>
                  <input 
                    bind:value={addStatusUpdateQuery.date_of_status_update}
                    type="date"
                    class="glass-input w-full"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Role</label>
                  <input 
                    bind:value={addStatusUpdateQuery.role}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., President"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Status</label>
                  <input 
                    bind:value={addStatusUpdateQuery.membership_status}
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
                  Add Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}

    <!-- Update status update modal -->
    {#if showUpdateStatusUpdateModal}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        on:click|self={() => showUpdateStatusUpdateModal = false}
      >
        <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
          <div class="flex justify-between items-start p-6 border-b border-white/10">
            <h2 class="text-xl font-semibold text-primary">Update Status Update</h2>
            <button 
              class="text-secondary hover:text-primary transition-colors"
              on:click={() => {
                showUpdateStatusUpdateModal = false;
              }}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <form id="updateFeeForm" on:submit|preventDefault={()=>updateStatusUpdateSubmit()}>
              <div class="space-y-4">
                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
                  <input 
                    bind:value={updateStatusUpdateQuery.student_number}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2020-0404"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Organization ID</label>
                  <input 
                    bind:value={updateStatusUpdateQuery.organization_id}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., Membership Fee"
                    disabled
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Committee</label>
                  <input 
                    bind:value={updateStatusUpdateQuery.committee}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., Membership"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Batch</label>
                  <input 
                    bind:value={updateStatusUpdateQuery.batch}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2022B"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Semester</label>
                  <select 
                    bind:value={updateStatusUpdateQuery.semester}
                    class="glass-input w-full"
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
                    bind:value={updateStatusUpdateQuery.academic_year}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2022-2023"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Date of Status Update</label>
                  <input 
                    bind:value={updateStatusUpdateQuery.date_of_status_update}
                    type="date"
                    class="glass-input w-full"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Role</label>
                  <input 
                    bind:value={updateStatusUpdateQuery.role}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., President"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Status</label>
                  <input 
                    bind:value={updateStatusUpdateQuery.membership_status}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., Active"
                  />
                </div>

                <button 
                  type="submit"
                  class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
                  </svg>
                  Update Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}

    <!-- Delete status update modal -->
    {#if showDeleteStatusUpdateModal}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        on:click|self={() => showDeleteStatusUpdateModal = false}
      >
        <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
          <div class="flex justify-between items-start p-6 border-b border-white/10">
            <h2 class="text-xl font-semibold text-primary">Delete Status Update</h2>
            <button 
              class="text-secondary hover:text-primary transition-colors"
              on:click={() => {
                showDeleteStatusUpdateModal = false;
              }}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <form id="deleteFeeForm" on:submit|preventDefault={()=>deleteStatusUpdateSubmit()}>
              <div class="space-y-4">
                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Semester</label>
                  <select 
                    bind:value={deleteStatusUpdateQuery.semester}
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
                    bind:value={deleteStatusUpdateQuery.academic_year}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2022-2023"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
                  <input 
                    bind:value={deleteStatusUpdateQuery.student_number}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2020-0404"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Organization ID</label>
                  <input 
                    bind:value={deleteStatusUpdateQuery.organization_id}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., FE-10000"
                    disabled
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
                  Delete Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}

</div>