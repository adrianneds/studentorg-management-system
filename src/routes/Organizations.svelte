<script>
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';

  let organizations = [];
  let loading = true;
  let error = null;
  let selectedOrg = null;
  let showFeeModal = false;
  let feeAmount = '';
  let feeDescription = '';
  let feeDueDate = '';
  let feeLoading = false;
  let feeError = null;
  let feeSuccess = false;

  onMount(async () => {
    if (!$auth || $auth.type !== 'organization') {
      navigate('/login');
      return;
    }

    // Simulate loading organizations
    setTimeout(() => {
      organizations = [
        {
          id: 1,
          name: 'Computer Society',
          description: 'A community of computer science enthusiasts',
          memberCount: 150,
          activeFees: 3,
          totalRevenue: 15000
        },
        {
          id: 2,
          name: 'Math Club',
          description: 'Exploring the beauty of mathematics',
          memberCount: 80,
          activeFees: 2,
          totalRevenue: 8000
        },
        {
          id: 3,
          name: 'Science Society',
          description: 'Advancing scientific knowledge and research',
          memberCount: 120,
          activeFees: 4,
          totalRevenue: 12000
        }
      ];
      loading = false;
    }, 1000);
  });

  function handleCreateFee(org) {
    selectedOrg = org;
    showFeeModal = true;
    feeError = null;
    feeSuccess = false;
  }

  function handleFeeSubmit() {
    feeLoading = true;
    feeError = null;

    // Simulate fee creation
    setTimeout(() => {
      const orgIndex = organizations.findIndex(o => o.id === selectedOrg.id);
      if (orgIndex !== -1) {
        organizations[orgIndex] = {
          ...organizations[orgIndex],
          activeFees: organizations[orgIndex].activeFees + 1
        };
      }
      feeSuccess = true;
      feeLoading = false;

      // Close modal after success
      setTimeout(() => {
        showFeeModal = false;
        selectedOrg = null;
      }, 2000);
    }, 1500);
  }
</script>

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Organizations</h1>
      <p class="text-secondary">Manage your student organizations</p>
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
            {#each organizations as org}
              <div class="glass-card p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-primary mb-1">{org.name}</h3>
                    <p class="text-secondary text-sm">{org.description}</p>
                  </div>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Members:</span>
                    <span class="text-primary">{org.memberCount}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Active Fees:</span>
                    <span class="text-primary">{org.activeFees}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Total Revenue:</span>
                    <span class="text-primary">${org.totalRevenue}</span>
                  </div>
                </div>
                <button 
                  class="glass-button w-full py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                  on:click={() => handleCreateFee(org)}
                >
                  Create Fee
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if showFeeModal}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass-card p-6 max-w-md w-full">
      <h2 class="text-xl font-semibold text-primary mb-4">Create New Fee</h2>
      
      {#if feeError}
        <div class="glass-badge bg-gradient-to-r from-red-500/20 to-pink-500/20 mb-4 p-3 text-center">
          {feeError}
        </div>
      {/if}

      {#if feeSuccess}
        <div class="glass-badge bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-4 p-3 text-center">
          Fee created successfully!
        </div>
      {:else}
        <div class="space-y-4">
          <div>
            <label class="block text-secondary text-sm font-medium mb-2">Amount</label>
            <input 
              type="number" 
              bind:value={feeAmount}
              class="glass-input"
              placeholder="Enter fee amount"
            />
          </div>

          <div>
            <label class="block text-secondary text-sm font-medium mb-2">Description</label>
            <input 
              type="text" 
              bind:value={feeDescription}
              class="glass-input"
              placeholder="Enter fee description"
            />
          </div>

          <div>
            <label class="block text-secondary text-sm font-medium mb-2">Due Date</label>
            <input 
              type="date" 
              bind:value={feeDueDate}
              class="glass-input"
            />
          </div>

          <button 
            class="glass-button w-full py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
            on:click={handleFeeSubmit}
            disabled={feeLoading}
          >
            {#if feeLoading}
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            {:else}
              Create Fee
            {/if}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  h1 {
    color: var(--text-primary);
  }
</style>