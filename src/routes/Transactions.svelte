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

    let addTransactionQuery = {
        student_number: '',
        fee_id: '',
        payment_date: 0,
        payment_status: '',
        semester: '',
        academic_year: ''
    };

    let updateTransactionQuery = {
        transaction_id: '',
        student_number: '',
        fee_id: '',
        payment_date: 0,
        payment_status: '',
        semester: '',
        academic_year: ''        
    }

    let deleteTransactionQuery = {
        transaction_id: ''
    }

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

    // NEW: get fees
    async function getFees() {
        await fetch(`http://localhost:5000/organization/viewFees/user/${$auth.organization_id}`,
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

        if (type != "delete") {
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
    await fetch(`http://localhost:5000/organization/addTransaction`,
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

    await fetch(`http://localhost:5000/organization/updateTransaction`,
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

    await fetch(`http://localhost:5000/organization/deleteTransaction`,
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
      await fetch(`http://localhost:5000/organization/viewTransactions/user/${$auth.organization_id}`,
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

<!-- transaction_id, student_number, fee_id, fee_amount, fee_name issue_date, semester_issued,
    academic_year_issued, due_date, payment_date, payment_status, semester, academic_year -->

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Transaction id
                </th>
                <th scope="col" class="px-6 py-3">
                    Student Number
                </th>
                <th scope="col" class="px-6 py-3">
                    Member Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Fee ID
                </th>
                <th scope="col" class="px-6 py-3">
                    Fee Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Payment Status
                </th>
                <th scope="col" class="px-6 py-3">
                    Issue date
                </th>
                <th scope="col" class="px-6 py-3">
                    Sem/AY issued
                </th>
                <th scope="col" class="px-6 py-3">
                    Due date
                </th>
                <th scope="col" class="px-6 py-3">
                    Payment status
                </th>
                <th scope="col" class="px-6 py-3">
                    Payment date
                </th>
            </tr>
        </thead>
        {#each transactions as transaction}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {transaction.transaction_id}
                </th>
                <td class="px-6 py-4">
                    {transaction.student_number}
                </td>
                <td class="px-6 py-4">
                    {transaction.member_name}
                </td>
                <td class="px-6 py-4">
                    {transaction.fee_id}
                </td>
                <td class="px-6 py-4">
                    {transaction.fee_name}
                </td>
                <td class="px-6 py-4">
                    {transaction.payment_status}
                </td>
                <td class="px-6 py-4">
                    {transaction.issue_date.slice(0,10)}
                </td>
                <td class="px-6 py-4">
                    {transaction.semester_issued}/{transaction.academic_year_issued}
                </td>
                <td class="px-6 py-4">
                    {transaction.due_date.slice(0,10)}
                </td>
                <td class="px-6 py-4">
                    {transaction.payment_status}
                </td>
                <td class="px-6 py-4">
                    {transaction.payment_date == null ? 'N/A' : transaction.payment_date.slice(0,10)}
                </td>
            </tr>
        {/each}
    </table>
</div>
</div>

<!-- Add transaction modal -->
{#if showAddTransactionModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Add Transaction
                </h3>
                <button on:click={()=>{showAddTransactionModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "updateFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>addTransactionSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Number</label>
                        <input bind:value={addTransactionQuery.student_number} required type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2020-04040">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="fee_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee ID</label>
                        <input bind:value={addTransactionQuery.fee_id} required type="text" name="fee_id" id="fee_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., FE-10000">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="payment_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment Date</label>
                        <input bind:value={addTransactionQuery.payment_date} type="date" name="payment_date" id="payment_date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 100">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="payment_status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment Status</label>
                        <select bind:value={addTransactionQuery.payment_status} required id="payment_status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester</label>
                        <select bind:value={addTransactionQuery.semester} id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="academic_year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Academic Year</label>
                        <input bind:value={addTransactionQuery.academic_year} type="text" name="academic_year" id="academic_year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
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

<!-- Update transaction modal -->
{#if showUpdateTransactionModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Update Transaction
                </h3>
                <button on:click={()=>{showUpdateTransactionModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "updateFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>updateTransactionSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="transaction_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction ID</label>
                        <input bind:value={updateTransactionQuery.transaction_id} required type="text" name="transaction_id" id="transaction_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 1000" >
                    </div>
                    <div class="col-span-2">
                        <label for="student_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Number</label>
                        <input bind:value={updateTransactionQuery.student_number} type="text" name="student_number" id="student_number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2020-0404">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="fee_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee ID</label>
                        <input bind:value={updateTransactionQuery.fee_id} type="text" name="fee_id" id="fee_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., FE-10000">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="payment_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment Date</label>
                        <input bind:value={updateTransactionQuery.payment_date} type="date" name="payment_date" id="payment_date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 100">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="payment_status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment Status</label>
                        <select bind:value={updateTransactionQuery.payment_status} id="payment_status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester</label>
                        <select bind:value={updateTransactionQuery.semester} id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="academic_year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Academic Year</label>
                        <input bind:value={updateTransactionQuery.academic_year} type="text" name="academic_year" id="academic_year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
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

<!-- Delete transaction modal -->
{#if showDeleteTransactionModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Transaction
                </h3>
                <button on:click={()=>{showDeleteTransactionModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "deleteFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>deleteTransactionSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="transaction_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction ID</label>
                        <input bind:value={deleteTransactionQuery.transaction_id} required type="text" name="transaction_id" id="transaction_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 1000" >
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
</style>