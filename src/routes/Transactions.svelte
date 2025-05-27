<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let transactions = [];
    let currentTransactions = [];

    let fees = [];
    let members = [];
    let memberQuery = {student_number:'',  committee:"", role:"", gender:"", degree_program:"", batch:"",membership_status:""} 

    let updateValid = false;
    let deleteValid = false;

    let showAddTransactionModal = false;
    let showUpdateTransactionModal = false;
    let showDeleteTransactionModal = false;

  function incrementDate(dateString) {
      const date = new Date(dateString);
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      return adjustedDate.toISOString().slice(0,10);
  }

    let addTransactionQuery = {
        student_number: '',
        fee_id: '',
        payment_date: '',
        payment_status: '',
        semester: '',
        academic_year: ''
    };

    let updateTransactionQuery = {
        transaction_id: '',
        student_number: '',
        fee_id: '',
        payment_date: '',
        payment_status: '',
        semester: '',
        academic_year: ''        
    }

    let deleteTransactionQuery = {
        transaction_id: ''
    }

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

    // NEW: get fees
    async function getFees() {
        await fetch(`http://localhost:5001/organization/viewFees/user/${$auth.organization_id}`,
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        }
        )
        .then(response => response.json())
        .then(data => {
        fees = data;
        console.log(fees);
        }).catch(error => {
        console.log(error);
        return [];
        });
    };


    async function validateFormInput(query, type) {

        deleteValid = false; // indicates valid delete 
        updateValid = false; // indicates valid update

        var success = true; // indicates valid output
        var alertText = "" // alert contents (pinagiisa ko na lahat ng error para mabilis)

        if (type == "add") {
            if (query.academic_year.slice(4,5) != '-' || !isNaN(query.academic_year) || query.academic_year.length != 9)  {
                alertText += "Please enter a valid academic year.\n"
                success = false;
            } 

            // syntax for finding value in array of objects (members) with key (student_number)
            let studno = members.find(({ student_number }) => student_number == query.student_number);

            if (studno == undefined) { // not found, not existing studno
                console.log("found: " + studno)
                success = false;
                alertText += "Please enter an existing student number.\n"
            }

            // do the same for fee id, not allowed nonexistent fee
            let feeid = fees.find(({ fee_id }) => fee_id == query.fee_id);
            if (feeid == undefined) {
                console.log("found: " + feeid)
                success = false;
                alertText += "Please enter an existing fee id.\n"
            }
        }

        // do the same for transaction id
        if (type == "delete" || type == 'update') {
            let transactionid = currentTransactions.find(({ transaction_id }) => transaction_id == query.transaction_id);
            if (transactionid == undefined) {
                console.log("found: " + transactionid)
                success = false;
                alertText += "Please enter an existing transaction id.\n"
            }
        }

        if (type == 'update') {
            if (query.student_number=='' && query.fee_id== '' &&
                query.payment_date==''&&query.payment_status==''&&query.semester==''&&query.academic_year=='') {
                success = false;
                alertText += "Please fill out at least one field.\n"
            }
        }

        if (success == true) {
            console.log(success)
            // all valid inputs, ready for querying in db
            deleteValid = true;
            updateValid = true;
            return true;
        } else {
            alert(alertText) // error alert ; at least one condition is not met
            return false;
        }

    }

    // NEW: add transaction
  async function addTransaction() {
    await fetch(`http://localhost:5001/organization/addTransaction`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addTransactionQuery)
    }
    )
    .then(response => {if (response.ok) 
        {alert("Successfully added transaction!"); response.json()} })
    .then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

  // NEW: update transaction
  async function updateTransaction() {

    await fetch(`http://localhost:5001/organization/updateTransaction`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateTransactionQuery)
    }
    )
    .then(response => {if (response.ok && updateValid == true) 
        {alert("Successfully updated transaction!"); response.json()} })
    .then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

  // NEW: delete transaction
  async function deleteTransaction() {

    await fetch(`http://localhost:5001/organization/deleteTransaction`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deleteTransactionQuery)
    }
    )
    .then(response => {if (response.ok && deleteValid == true) 
        {alert("Successfully deleted transaction!"); response.json()} })
    .then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

    // handle submit for add transaction
  async function addTransactionSubmit() {
    if (!validateFormInput(addTransactionQuery, 'add')) {
        return;
    }
    addTransactionQuery.organization_id = id
    await addTransaction();

    // reset query
    addTransactionQuery = {
        student_number: '',
        fee_id: '',
        payment_date: 0,
        payment_status: '',
        semester: '',
        academic_year: ''
    };

    showAddTransactionModal = false; 
    getTransactions();
  }
  
    // handle submit for add transaction
  async function updateTransactionSubmit() {

    currentTransactions = transactions;
    if (!validateFormInput(updateTransactionQuery, 'update')) {
        return;
    }
    updateTransactionQuery.organization_id = id
    await updateTransaction();

    // reset query
    updateTransactionQuery = {
        transaction_id:'',
        student_number: '',
        fee_id: '',
        payment_date: 0,
        payment_status: '',
        semester: '',
        academic_year: ''
    };

    showUpdateTransactionModal = false; 
    getTransactions();
  }

  // handle submit for delete fee
  async function deleteTransactionSubmit() {

    currentTransactions = transactions;
    if (!validateFormInput(deleteTransactionQuery, 'delete')) {
        return;
    }

    deleteTransactionQuery.organization_id = id
    console.log(deleteTransactionQuery)
    await deleteTransaction();

    // reset query
    deleteTransactionQuery = {
      transaction_id: ''
    };

    showDeleteTransactionModal = false; 
    getTransactions();
  }

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    var id = JSON.parse(localStorage.getItem('user')).organization_id
    console.log(username)

    // NEW: import member with late payments from db server
    async function getTransactions() {
      await fetch(`http://localhost:5001/organization/viewTransactions/user/${$auth.organization_id}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        transactions = data;
        console.log(transactions);
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
        await getTransactions();
        await getFees();
        await getMembers();
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
    <br>
    <div class="max-w-7xl mx-auto h-full flex flex-col">
        <div class="cud-header mb-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-primary mb-2"> Transactions </h1>
                <p class="text-secondary"> Manage all transactions from organization members </p>
            </div>
            <div class="cud-container p-6">
                <div class="cud-options-container">
                    <button on:click={()=>{showAddTransactionModal=true}} class="glass-button text-sm py-2 flex items-center" type="button" data-modal-target="crud-modal" data-modal-toggle="crud-modal">
                        Add Transaction
                    </button> <br>
                    <button on:click={()=>{showUpdateTransactionModal=true}} class="glass-button text-sm py-2 flex items-center">
                        Update Transaction
                    </button>
                    <br>
                    <button on:click={()=>{showDeleteTransactionModal=true}} class="glass-button text-sm py-2 flex items-center">
                        Delete Transaction
                    </button>
                </div>
            </div>
        </div>

        <div class="glass-table-container">
            <table class="glass-table">
                <thead>
                    <tr>
                        <th scope="col">
                            Transaction id
                        </th>
                        <th scope="col">
                            Student Number
                        </th>
                        <th scope="col">
                            Member Name
                        </th>
                        <th scope="col">
                            Fee ID
                        </th>
                        <th scope="col">
                            Fee Name
                        </th>
                        <th scope="col">
                            Payment Status
                        </th>
                        <th scope="col">
                            Issue date
                        </th>
                        <th scope="col">
                            Sem/AY issued
                        </th>
                        <th scope="col">
                            Due date
                        </th>
                        <th scope="col">
                            Payment date
                        </th>
                    </tr>
                </thead>
                <tbody>
                {#each transactions as transaction}
                    <tr>
                        <th scope="row">
                            {transaction.transaction_id}
                        </th>
                        <td>
                            {transaction.student_number}
                        </td>
                        <td>
                            {transaction.member_name}
                        </td>
                        <td>
                            {transaction.fee_id}
                        </td>
                        <td>
                            {transaction.fee_name}
                        </td>
                        <td>
                            {transaction.payment_status}
                        </td>
                        <td>
                            {incrementDate(transaction.issue_date)}
                        </td>
                        <td>
                            {transaction.semester_issued}/{transaction.academic_year_issued}
                        </td>
                        <td>
                            {incrementDate(transaction.due_date)}
                        </td>
                        <td>
                            {transaction.payment_date == null ? 'N/A' : incrementDate(transaction.payment_date)}
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add transaction modal -->
    {#if showAddTransactionModal}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        on:click|self={() => showAddTransactionModal = false}
      >
        <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
          <div class="flex justify-between items-start p-6 border-b border-white/10">
            <h2 class="text-xl font-semibold text-primary">Add Transaction</h2>
            <button 
              class="text-secondary hover:text-primary transition-colors"
              on:click={() => {
                showAddTransactionModal = false;
              }}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <form id="addTransactionForm" on:submit|preventDefault={()=>addTransactionSubmit()}>
              <div class="space-y-4">
                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
                  <input 
                    bind:value={addTransactionQuery.student_number}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2020-04040"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Fee ID</label>
                  <input 
                    bind:value={addTransactionQuery.fee_id}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., FE-10000"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Payment Date</label>
                  <input 
                    bind:value={addTransactionQuery.payment_date}
                    type="date"
                    class="glass-input w-full"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Payment Status</label>
                  <select 
                    bind:value={addTransactionQuery.payment_status}
                    class="glass-input w-full"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Semester</label>
                  <select 
                    bind:value={addTransactionQuery.semester}
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
                    bind:value={addTransactionQuery.academic_year}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2022-2023"
                  />
                </div>

                <button 
                  type="submit"
                  class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
                  </svg>
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}

    <!-- Update transaction modal -->
    {#if showUpdateTransactionModal}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        on:click|self={() => showUpdateTransactionModal = false}
      >
        <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
          <div class="flex justify-between items-start p-6 border-b border-white/10">
            <h2 class="text-xl font-semibold text-primary">Update Transaction</h2>
            <button 
              class="text-secondary hover:text-primary transition-colors"
              on:click={() => {
                showUpdateTransactionModal = false;
              }}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <form id="updateTransactionForm" on:submit|preventDefault={()=>updateTransactionSubmit()}>
              <div class="space-y-4">
                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Transaction ID</label>
                  <input 
                    bind:value={updateTransactionQuery.transaction_id}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 1000"
                    required
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Student Number</label>
                  <input 
                    bind:value={updateTransactionQuery.student_number}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2020-0404"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Fee ID</label>
                  <input 
                    bind:value={updateTransactionQuery.fee_id}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., FE-10000"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Payment Date</label>
                  <input 
                    bind:value={updateTransactionQuery.payment_date}
                    type="date"
                    class="glass-input w-full"
                  />
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Payment Status</label>
                  <select 
                    bind:value={updateTransactionQuery.payment_status}
                    class="glass-input w-full"
                  >
                    <option value="">Select option</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Semester</label>
                  <select 
                    bind:value={updateTransactionQuery.semester}
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
                    bind:value={updateTransactionQuery.academic_year}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 2022-2023"
                  />
                </div>

                <button 
                  type="submit"
                  class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
                  </svg>
                  Update Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}

    <!-- Delete transaction modal -->
    {#if showDeleteTransactionModal}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        on:click|self={() => showDeleteTransactionModal = false}
      >
        <div class="glass-card max-w-md w-full max-h-[70vh] flex flex-col">
          <div class="flex justify-between items-start p-6 border-b border-white/10">
            <h2 class="text-xl font-semibold text-primary">Delete Transaction</h2>
            <button 
              class="text-secondary hover:text-primary transition-colors"
              on:click={() => {
                showDeleteTransactionModal = false;
              }}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <form id="deleteTransactionForm" on:submit|preventDefault={()=>deleteTransactionSubmit()}>
              <div class="space-y-4">
                <div>
                  <label class="block text-secondary text-sm font-medium mb-2">Transaction ID</label>
                  <input 
                    bind:value={deleteTransactionQuery.transaction_id}
                    type="text"
                    class="glass-input w-full"
                    placeholder="i.e., 1000"
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
                  Delete Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}



</div>

<style>
    table {
        overflow-y:auto;
    }
    th, tr, td {
        font-size: 0.8vw;
    }
    td {
        padding-left: 0;
        padding-right:0;
        text-align: center;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
        opacity: 0.7;
    }

    input[type="date"]::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
    }

    input[type="date"]::-webkit-inner-spin-button,
    input[type="date"]::-webkit-clear-button {
        filter: invert(1);
    }
</style>