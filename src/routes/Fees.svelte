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
  
  onMount(async () => {
    if (!$auth || $auth.type !== 'organization') {
      navigate('/login');
      return;
    }

    // Simulate loading organization and fees
    setTimeout(() => {
      organization = {
        id: 1,
        name: 'Computer Society',
        description: 'A community of computer science enthusiasts',
        totalMembers: 150,
        activeMembers: 145,
        totalRevenue: 75000,
        pendingPayments: 25000,
        overduePayments: 5000
      };

      fees = [
        {
          id: 1,
          name: 'Annual Membership Fee',
          amount: 500,
          dueDate: '2024-03-31',
          status: 'pending',
          paymentMethod: null,
          paymentDate: null,
          pendingPayments: 75,
          overduePayments: 15
        },
        {
          id: 2,
          name: 'Event Registration Fee',
          amount: 200,
          dueDate: '2024-02-28',
          status: 'paid',
          paymentMethod: 'GCash',
          paymentDate: '2024-02-15',
          pendingPayments: 0,
          overduePayments: 0
        },
        {
          id: 3,
          name: 'Workshop Fee',
          amount: 300,
          dueDate: '2024-01-31',
          status: 'overdue',
          paymentMethod: null,
          paymentDate: null,
          pendingPayments: 30,
          overduePayments: 20
        }
      ];
      loading = false;
    }, 1000);
  });

  function handleViewFee(fee) {
    selectedFee = fee;
    showPopup = true;
  }

  function closePopup() {
    showPopup = false;
    selectedFee = null;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  }

  function formatDate(dateString) {
    if (!dateString) return 'Not paid';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Paid':
        return 'from-green-500/20 to-emerald-500/20';
      case 'Pending':
        return 'from-yellow-500/20 to-amber-500/20';
      case 'Overdue':
        return 'from-red-500/20 to-pink-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  }

  function handlePayment(fee) {
    selectedFee = fee;
    showPaymentModal = true;
    paymentMethod = '';
    paymentError = null;
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

  $: filteredFees = fees.filter(fee => {
    const matchesSearch = fee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || fee.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
</script>

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <Link to="/organization-dashboard" class="glass-button text-sm py-2 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      <h1 class="text-3xl font-bold text-primary pt-4 mb-2">Fee Management</h1>
      <p class="text-secondary">Manage organization fees and payments</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Total Revenue</div>
        <div class="text-2xl font-semibold text-primary">₱{organization?.totalRevenue?.toLocaleString() || 0}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Pending Payments</div>
        <div class="text-2xl font-semibold text-primary">₱{organization?.pendingPayments?.toLocaleString() || 0}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Overdue Payments</div>
        <div class="text-2xl font-semibold text-primary">₱{organization?.overduePayments?.toLocaleString() || 0}</div>
      </div>
      <div class="glass-card p-6">
        <div class="text-sm text-secondary mb-1">Active Members</div>
        <div class="text-2xl font-semibold text-primary">{organization?.activeMembers || 0}</div>
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
        <div class="h-full overflow-y-auto pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredFees as fee}
              <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-primary mb-1">{fee.name}</h3>
                    <p class="text-secondary text-sm">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div class="glass-badge {
                    fee.status === 'paid' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' :
                    fee.status === 'overdue' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20' :
                    'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'
                  }">
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Amount:</span>
                    <span class="text-primary">₱{fee.amount.toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Pending:</span>
                    <span class="text-primary">{fee.pendingPayments} members</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Overdue:</span>
                    <span class="text-primary">{fee.overduePayments} members</span>
                  </div>
                  {#if fee.paymentMethod}
                    <div class="flex justify-between text-sm">
                      <span class="text-secondary">Payment Method:</span>
                      <span class="text-primary">{fee.paymentMethod}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-secondary">Payment Date:</span>
                      <span class="text-primary">{new Date(fee.paymentDate).toLocaleDateString()}</span>
                    </div>
                  {/if}
                </div>

                {#if fee.status !== 'paid'}
                  <button 
                    class="glass-button w-full text-sm py-2 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                    on:click={() => handlePayment(fee)}
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Process Payment
                  </button>
                {/if}
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

<style>
  h1 {
    color: var(--text-primary);
  }
</style>
