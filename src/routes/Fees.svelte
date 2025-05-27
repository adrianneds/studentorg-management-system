<script>
  import { Link } from "svelte-routing";
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  
  let organization = null;
  let fees = [];
  let selectedFee = null;
  let showPopup = false;
  let loading = true;
  let error = null;
  let searchQuery = '';
  let filterStatus = 'all';
  let showPaymentModal = false;
  let paymentMethod = '';
  let processingPayment = false;
  let paymentError = null;
  let feeStatus = {'unpaid':999, 'paid':999}
  let currdate = new Date().toISOString().slice(0, 10);
  let dateInput = '2025-05-10';
  let showAddFeeModal = false;
  let showUpdateFeeModal = false;
  let showDeleteFeeModal = false;

  let deleteValid = false;
  let updateValid = false;
  
  let updateFeeQuery = {
    fee_id: '',
    fee_name: '',
    fee_amount: '',
    due_date: '',
    issue_date: '',
    semester_issued: '',
    academic_year_issued: ''
  }

  let addFeeQuery = {
    fee_id: '',
    fee_name: '',
    fee_amount: '',
    issue_date: '',
    semester_issued: '',
    academic_year_issued: '',
    due_date: '',
    organization_id: id
  };

  let deleteFeeQuery = {
    fee_id: ''
  }


  function changeDate(date) {
    currdate = incrementDate(date)
    getFeeStatus();
  }

  // NEW: getting username
  var username = JSON.parse(localStorage.getItem('user')).organization_username
  var id = JSON.parse(localStorage.getItem('user')).organization_id
  console.log(id)
  console.log(username)

  function incrementDate(dateString) {
      const date = new Date(dateString);
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      return adjustedDate.toISOString().slice(0,10);
  }

  // NEW: import member with unpaid fees data from db server
  async function getFeeStatus() {
    await fetch(`http://localhost:5001/organization/feeStatus/user/${$auth.organization_id}?date=${currdate}`,
      {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
    .then(response => response.json())
    .then(data => {
      feeStatus = data[0];
      console.log(feeStatus);
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

  // NEW: add fee
  async function addFee() {
    await fetch(`http://localhost:5001/organization/addFee`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addFeeQuery)
    }
    )
    .then(response => {if (!response.ok) 
        {alert("Something went wrong. Make sure to enter a unique fee id."); return}
        else {alert("Successfully added fee!"); response.json()} })
    .then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

  // NEW: update fee
  async function updateFee() {
    console.log("UPDATE FEE ")
    console.log(updateFeeQuery)

    await fetch(`http://localhost:5001/organization/updateFee`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateFeeQuery)
    }
    )
    .then(response => {if (response.ok && updateValid == true) 
        {alert("Successfully updated fee!"); response.json()} })
    .then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

  // NEW: delete fee
  async function deleteFee() {
    console.log("DELETE FEE ")
    console.log(deleteFeeQuery)

    await fetch(`http://localhost:5001/organization/deleteFee`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deleteFeeQuery)
    }
    )
    .then(response => {if (response.ok && deleteValid == true) 
        {alert("Successfully deleted fee!"); response.json()} })
    .then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

  // handle submit for add fee
  async function addFeeSubmit() {
    if (!validateFormInput(addFeeQuery, 'add')) {
      return;
    }
    addFeeQuery.organization_id = id
    console.log(addFeeQuery)
    await addFee();
    getFees();

    // reset query
    addFeeQuery = {
      fee_id: '',
      fee_name: '',
      fee_amount: 0,
      issue_date: '',
      semester_issued: '',
      academic_year_issued: '',
      due_date: '',
      organization_id: id
    };

    showAddFeeModal = false; 
  }

  // handle submit for update fee
  async function updateFeeSubmit() {
    if (!validateFormInput(updateFeeQuery, 'update')) {
      return;
    }

    console.log("AFTER VALIDATION")
    console.log(updateFeeQuery)

    updateFeeQuery.organization_id = id
    await updateFee();

    // reset query
    updateFeeQuery = {
      fee_id: '',
      fee_name: '',
      fee_amount: 0,
      issue_date: '',
      semester_issued: '',
      academic_year_issued: '',
      due_date: '',
      organization_id: id
    };

    console.log("AFTER UPDATE QUERY")
    console.log(updateFeeQuery)

    showUpdateFeeModal = false; 
    getFees();
  }
  
  // handle submit for delete fee
  async function deleteFeeSubmit() {
    if (!validateFormInput(deleteFeeQuery, 'delete')) {
      return;
    }
    deleteFeeQuery.organization_id = id
    console.log(deleteFeeQuery)
    await deleteFee();

    // reset query
    deleteFeeQuery = {
      fee_id: ''
    };

    showDeleteFeeModal = false; 
    getFees();
  }

  onMount(async () => {
    if (!$auth || $auth.type !== 'organization') {
      navigate('/login');
      return;
    }
    getFeeStatus();
    getFees();
    loading = false;
  });

  function closePopup() {
    showPopup = false;
    selectedFee = null;
  }

  async function handlePaymentSubmit() {
    if (!paymentMethod) {
      paymentError = 'Please select a payment method';
      return;
    }

    processingPayment = true;
    paymentError = null;

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update fee status
    const feeIndex = fees.findIndex(f => f.id === selectedFee.id);
    if (feeIndex !== -1) {
      fees[feeIndex] = {
        ...fees[feeIndex],
        status: 'paid',
        paymentMethod,
        paymentDate: new Date().toISOString().split('T')[0],
        pendingPayments: 0,
        overduePayments: 0
      };
    }

    processingPayment = false;
    showPaymentModal = false;
  }

  async function validateFormInput(query, type) {

    deleteValid = false; // indicates valid delete 
    updateValid = false; // indicates valid update

    var success = true; // indicates valid output
    var alertText = "" // alert contents (pinagiisa ko na lahat ng error para mabilis)

    console.log("VALIDATION STAGE")
    console.log(query)

    if (type == "add") {

        if (query.academic_year.slice(4,5) != '-' || !isNaN(query.academic_year) || query.academic_year.length != 9)  {
          alertText += "Please enter a valid academic year.\n"
          success = false;
        } 

        if (parseInt(query.fee_amount) < 0) {
          success = false;
          alertText += "Please enter a valid fee amount.\n"
        }

        let feeid = fees.find(({ fee_id }) => fee_id == query.fee_id);
        if (feeid || feeid != undefined) { 
          console.log("found: " + feeid)
          success = false;
          alertText += "Please enter a unique fee ID.\n"
        }

    }

    if (type == "delete" || type == 'update') {
        let feeid = fees.find(({ fee_id }) => fee_id == query.fee_id);
        if (feeid == undefined) { 
          console.log("found: " + feeid)
          success = false;
          alertText += "Please enter an existing fee ID.\n"
        }

    }

    if (type == 'update') {

      if (query.fee_amount== '' && query.due_date==''&&
        query.issue_date==''&&query.semester_issued==''&&query.academic_year_issued=='') {
        success = false;
        alertText += "Please fill out at least one field."
      }

      if (query.academic_year_issued != '') {
        if (query.academic_year_issued.slice(4,5) != '-' || !isNaN(query.academic_year_issued) || query.academic_year_issued.length != 9)  {
        alertText += "Please enter a valid academic year.\n"
        success = false;
        } 
      }

      if (parseInt(query.fee_amount) <= 0) {
        success = false;
        alertText += "Please enter a valid fee amount.\n"
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

</script>

<div class="h-full py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    
    
    <div class="fee cud-header mb-1">
      
    <div class="mb-8">

      <div class="flex items-center gap-4 mb-2">
        <Link to="/organization-dashboard" class="glass-button text-sm py-2 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <h1 class="text-3xl font-bold text-primary pt-4 mb-2 w-50">Fee Management</h1>
      <p class="text-secondary">Manage organization fees and payments</p>

    </div>
    <div class="cud-container p-6">
        <div class="cud-options-container">
            <button on:click={()=>{showAddFeeModal=true}} class="glass-button text-sm py-2 flex items-center" type="button" data-modal-target="crud-modal" data-modal-toggle="crud-modal">
            Add Fee
            </button> <br>
            <button on:click={()=>{showUpdateFeeModal=true}} class="glass-button text-sm py-2 flex items-center">
            Update Fee
            </button>
            <br>
            <button on:click={()=>{showDeleteFeeModal=true}} class="glass-button text-sm py-2 flex items-center">
            Delete Fee
            </button>
        </div>
    </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Total Revenue</div>
        <div class="text-2xl font-semibold text-primary">₱{feeStatus.paid}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Pending Payments</div>
        <div class="text-2xl font-semibold text-primary">₱{feeStatus.unpaid}</div>
      </div>

      <div class="fee-dashboard-date glass-card p-6">
        <div class="text-sm text-secondary mb-1"> Revenue and pending fees as of... </div>
        <div class = "flex flex-row">
          <input class = "dateInput fee-dashboard" type="date" bind:value={dateInput} min="1970-01-01" />
          <button class = "date-input-submit" id = "submitButton" type="button" on:click={() => changeDate(dateInput)}> Submit </button>
        </div>
      </div>

      <!-- <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Overdue Payments</div>
        <div class="text-2xl font-semibold text-primary">₱{organization?.overduePayments?.toLocaleString() || 0}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Active Members</div>
        <div class="text-2xl font-semibold text-primary">{organization?.activeMembers || 0}</div>
      </div> -->
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
        <div class="fee-card-container overflow-y-auto pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each fees as fee}
              <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-primary mb-1">{fee.fee_name}</h3>
                    <p class="text-secondary text-sm">Due: {fee.due_date.slice(0,10)}</p>
                  </div>
                  <div class="glass-badge bg-gradient-to-r from-green-500/20 to-emerald-500/20
                    bg-gradient-to-r from-yellow-500/20 to-orange-500/20 ">
                    {fee.fee_id}
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Amount:</span>
                    <span class="text-primary">₱{fee.fee_amount}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Sem/AY Issued:</span>
                    <span class="text-primary">{fee.semester_issued}/{fee.academic_year_issued} </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Date Issued:</span>
                    <span class="text-primary">{fee.issue_date.slice(0,10)} </span>
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

{#if showPopup && selectedFee}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass-card p-6 max-w-md w-full">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-semibold text-primary">{selectedFee.name}</h2>
        <button 
          class="text-secondary hover:text-primary transition-colors"
          on:click={closePopup}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Amount</label>
          <p class="text-primary text-xl">₱{selectedFee.amount.toFixed(2)}</p>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Due Date</label>
          <p class="text-primary">{new Date(selectedFee.dueDate).toLocaleDateString()}</p>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Status</label>
          <div class="glass-badge inline-block {selectedFee.status === 'active' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'}">
            {selectedFee.status.charAt(0).toUpperCase() + selectedFee.status.slice(1)}
          </div>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Members</label>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Total:</span>
              <span class="text-primary">{selectedFee.totalMembers}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Paid:</span>
              <span class="text-primary">{selectedFee.paidMembers}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Pending:</span>
              <span class="text-primary">{selectedFee.pendingPayments}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Overdue:</span>
              <span class="text-primary">{selectedFee.overduePayments}</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Revenue</label>
          <p class="text-primary">₱{selectedFee.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showPaymentModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="glass-card p-6 max-w-md w-full">
      <h2 class="text-xl font-semibold text-primary mb-4">Process Payment</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Fee</label>
          <p class="text-primary">{selectedFee?.name}</p>
        </div>
        
        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Amount</label>
          <p class="text-primary">₱{selectedFee?.amount.toLocaleString()}</p>
        </div>
        
        <div>
          <label class="block text-secondary text-sm font-medium mb-2">Payment Method</label>
          <select 
            bind:value={paymentMethod}
            class="glass-input w-full"
          >
            <option value="">Select payment method</option>
            <option value="GCash">GCash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
          {#if paymentError}
            <p class="text-red-500 text-sm mt-1">{paymentError}</p>
          {/if}
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button 
          class="glass-button px-4 py-2 text-sm"
          on:click={() => showPaymentModal = false}
          disabled={processingPayment}
        >
          Cancel
        </button>
        <button 
          class="glass-button px-4 py-2 text-sm bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
          on:click={handlePaymentSubmit}
          disabled={processingPayment}
        >
          {#if processingPayment}
            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
            Processing...
          {:else}
            Confirm Payment
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Add fee modal -->
{#if showAddFeeModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Add Fee
                </h3>
                <button on:click={()=>{showAddFeeModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "addFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>addFeeSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="fee_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee ID</label>
                        <input bind:value={addFeeQuery.fee_id} required type="text" name="fee_id" id="fee_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., FE-10000">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="fee_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee Name</label>
                        <input bind:value={addFeeQuery.fee_name} required type="text" name="fee_name" id="fee_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Membership Fee">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="fee_amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee Amount</label>
                        <input bind:value={addFeeQuery.fee_amount} required type="number" name="fee_amount" id="fee_amount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 100">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="issue_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Issue Date</label>
                        <input bind:value={addFeeQuery.issue_date} required type="date" name="issue_date" id="issue_date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester Issued</label>
                        <select bind:value={addFeeQuery.semester_issued} required id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="academic_year_issued" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Academic Year Issued</label>
                        <input bind:value={addFeeQuery.academic_year_issued} required type="text" name="academic_year_issued" id="academic_year_issued" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="issue_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date</label>
                        <input bind:value={addFeeQuery.due_date} required type="date" name="issue_date" id="issue_date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
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

<!-- Update fee modal -->
{#if showUpdateFeeModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Update Fee
                </h3>
                <button on:click={()=>{showUpdateFeeModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "updateFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>updateFeeSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="fee_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee ID</label>
                        <input bind:value={updateFeeQuery.fee_id} required type="text" name="fee_id" id="fee_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., FE-10000">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="fee_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee Name</label>
                        <input bind:value={updateFeeQuery.fee_name} type="text" name="fee_name" id="fee_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., Membership Fee">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="fee_amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee Amount</label>
                        <input bind:value={updateFeeQuery.fee_amount} type="number" name="fee_amount" id="fee_amount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 100">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="issue_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Issue Date</label>
                        <input bind:value={updateFeeQuery.issue_date} type="date" name="issue_date" id="issue_date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="semester" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semester Issued</label>
                        <select bind:value={updateFeeQuery.semester_issued} id="semester" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select option</option>
                            <option value="1S">1st Semester</option>
                            <option value="2S">2nd Semester</option>
                            <option value="M">Midyear</option>
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="academic_year_issued" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Academic Year Issued</label>
                        <input bind:value={updateFeeQuery.academic_year_issued} type="text"
                        name="academic_year_issued" id="academic_year_issued" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="due_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date</label>
                        <input bind:value={updateFeeQuery.due_date} type="date" name="due_date" id="due_date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., 2022-2023">
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

<!-- Delete fee modal -->
{#if showDeleteFeeModal}

<div id="crud-modal-1" tabindex="-1" aria-hidden="true" class="cud-modal-container overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="glass-card cud relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Fee
                </h3>
                <button on:click={()=>{showDeleteFeeModal=false}} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form id = "deleteFeeForm" class="p-4 md:p-5" on:submit|preventDefault={()=>deleteFeeSubmit()}>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="fee_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fee ID</label>
                        <input bind:value={deleteFeeQuery.fee_id} required type="text" name="fee_id" id="fee_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="i.e., FE-10000">
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
</style>
