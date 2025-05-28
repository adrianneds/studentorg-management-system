<script>
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  export let message = '';
  export let type = 'error'; // 'error', 'success', 'info', 'warning'
  export let duration = 3000;
  export let show = false;

  let timeout;

  $: if (show) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      show = false;
    }, duration);
  }

  function getTypeStyles() {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default:
        return 'bg-red-500/20 border-red-500/30 text-red-400';
    }
  }
</script>

{#if show}
  <div
    class="fixed bottom-20 right-4 z-[99999]"
    style="z-index: 99999; position: fixed;"
    transition:fly={{ y: 50, duration: 300, easing: quintOut }}
  >
    <div
      class="glass-card p-4 flex items-center space-x-3 {getTypeStyles()} shadow-lg backdrop-blur-md"
      transition:fade={{ duration: 200 }}
    >
      {#if type === 'error'}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      {:else if type === 'success'}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      {:else if type === 'warning'}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      {:else}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      {/if}
      <span class="text-sm font-medium">{message}</span>
    </div>
  </div>
{/if}

<style>
  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
  }
</style> 