<script>
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  import { Dropdown, initFlowbite } from 'flowbite';
  
  export let params = {};
  //let organization = null;
  let fees = [];
  let loading = true;
  let error = null;
  let searchQuery = '';
  let filterStatus = 'all';
  let selectedFee = null;
  let showPaymentModal = false;
  let paymentMethod = '';
  let processingPayment = false;
  let paymentError = null;

  let organizations = []
  let fee_status = "";
  let organization_selection = "";

  // NEW: import fee data from db server
  async function getFees() {
    console.log(organization_selection)
    fetch(`http://localhost:5001/member/transactions?student_number=${$auth.student_number}&status=${fee_status}&organization_id=${organization_selection}`)
    .then(response => response.json())
    .then(data => {
      fees = data;
      console.log(fees);
    }).catch(error => {
      console.log(error);
      return [];
    });
  };

  // NEW: get organization data from db server
  async function getOrganizations() {
    fetch(`http://localhost:5001/member/getOrganizations/user/${$auth.student_number}`)
    .then(response => response.json())
    .then(data => {
      organizations = data;
    }).catch(error => {
      console.log(error);
      return [];
    });
  };
  
  onMount(async () => {
    if (!$auth || $auth.type !== 'member') {
      navigate('/login');
      return;
    }
    getFees();
    getOrganizations();
    initFlowbite();

    // Simulate loading organization and fees
    setTimeout(() => {
      // organization = {
      //   id: params.orgId || 1,
      //   name: 'Computer Society',
      //   description: 'A community of computer science enthusiasts'
      // };

      loading = false;
    }, 1000);
  });

  function handlePayment(fee) {
    selectedFee = fee;
    paymentMethod = '';
    paymentError = null;
    showPaymentModal = true;
  }

  async function handlePaymentSubmit() {
    if (!paymentMethod) {
      paymentError = 'Please select a payment method';
      return;
    }

    processingPayment = true;
    paymentError = null;

    // Simulate payment processing
    setTimeout(() => {
      const updatedFees = fees.map(fee => {
        if (fee.id === selectedFee.id) {
          return {
            ...fee,
            status: 'paid',
            paymentMethod,
            paymentDate: new Date().toISOString().split('T')[0]
          };
        }
        return fee;
      });

      fees = updatedFees;
      processingPayment = false;
      showPaymentModal = false;
      selectedFee = null;
    }, 1500);
  }

</script>

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="flex items-center gap-4 mb-2">
      <Link to="/member-dashboard" class="glass-button text-sm py-2 flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>
    </div>
    <br>
    <div class="mb-8">
      <h1 class="mt-5 text-3xl font-bold text-primary mb-2"> Organization Fees</h1>
      <p class="text-secondary">View and manage your transactions </p>
    </div>

    <div class="mb-8 flex flex-row">
    <!-- Dropdown menu -->
    <button id="paymentStatusDropdown" data-dropdown-toggle="payment-status-dropdown" class="glass-dropdown" type="button">
        Payment Status
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="payment-status-dropdown" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
            <li>
                <a href="#payment" class="block px-4 py-2" on:click={() => {fee_status='Paid'; getFees()}}> Paid </a>
            </li>
            <li>
                <a href="#payment" class="block px-4 py-2" on:click={() => {fee_status='Unpaid'; getFees()}}> Unpaid </a>
            </li>
            <li>
                <a href="#payment" class="block px-4 py-2" on:click={() => {fee_status=''; getFees()}}> Any </a>
            </li>
        </ul>
    </div>

    <button id="paymentStatusDropdown" data-dropdown-toggle="organization-dropdown" class="ml-5 glass-dropdown" type="button">
        Organization
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="organization-dropdown" class="dropdown-options z-10 hidden">
        <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
          {#each organizations as org}
            <li>
              <a href="#organization" class="block px-4 py-2" on:click={() => {organization_selection=org.organization_id; getFees()}}>
                {org.organization_name}
              </a>
            </li>
          {/each}
            <li>
                <a href="#organization" class="block px-4 py-2" on:click={() => {organization_selection=''; getFees()}}> Any </a>
            </li>
        </ul>
    </div>

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
        <div class="transaction-container h-full overflow-y-auto pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each fees as fee}
              <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-primary mb-1">{fee.fee_name}</h3>
                    <h2 class="text-lg font-semibold text-primary mb-1">{fee.organization_name}</h2>
                    <p class="text-secondary text-sm">Due: {new Date(fee.due_date).toLocaleDateString()}</p>
                  </div>
                  <div class="glass-badge {
                    fee.payment_status === 'Paid' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' :
                    'unpaid-status-badge'
                  }">
                    {fee.payment_status.charAt(0).toUpperCase() + fee.payment_status.slice(1)}
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Amount:</span>
                    <span class="text-primary">₱{fee.fee_amount.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary"> Semester Issued: </span>
                    <span class="text-primary"> {fee.semester_issued} </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary"> AY Issued:  </span>
                    <span class="text-primary"> {fee.academic_year_issued} </span>
                  </div>

                  {#if fee.payment_status === 'Paid'}
                    <div class="flex justify-between text-sm">
                      <span class="text-secondary">Payment Date:</span>
                      <span class="text-primary">{new Date(fee.payment_date).toLocaleDateString()}</span>
                    </div>
                  {/if}
                </div>

                <!-- {#if fee.payment_status !== 'Paid'}
                  <button 
                    class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                    on:click={() => handlePayment(fee)}
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Pay Now
                  </button>
                {/if} -->
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if showPaymentModal && selectedFee}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass-card p-6 max-w-md w-full">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-semibold text-primary">Payment for {selectedFee.name}</h2>
        <button 
          class="text-secondary hover:text-primary transition-colors"
          on:click={() => {
            showPaymentModal = false;
            selectedFee = null;
            paymentError = null;
          }}
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

        <button 
          class="glass-button w-full py-2 flex items-center justify-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30"
          on:click={handlePaymentSubmit}
          disabled={processingPayment}
        >
          {#if processingPayment}
            <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-2"></div>
            Processing...
          {:else}
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Confirm Payment
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  h1 {
    color: var(--text-primary);
  }
</style> 