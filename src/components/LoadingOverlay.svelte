<script>
  import { loading, loadingMessage } from '../stores/loading';
</script>

{#if $loading}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] min-h-screen">
    <div class="glass-card p-8 flex flex-col items-center justify-center max-w-sm mx-auto my-auto">
      <svg class="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-primary text-lg text-center">{$loadingMessage || 'Loading...'}</p>
    </div>
  </div>
{/if} 