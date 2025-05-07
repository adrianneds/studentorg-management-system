<script>
  export let members = [];
  export let onEdit = (member) => {};
  export let onDelete = (member) => {};
</script>

<div class="card-grid">
  {#each members as member}
    <div class="glass-card p-6 transform transition-all duration-300 hover:scale-105">
      <div class="flex items-center mb-6">
        <div class="glass-avatar">
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="ml-4">
          <h3 class="text-primary font-semibold text-lg">{member.name}</h3>
          <div class="flex items-center gap-2">
            <span class="glass-badge">{member.role}</span>
            <span class="text-muted text-sm">{member.organization}</span>
          </div>
        </div>
      </div>
      
      <div class="space-y-3 mb-6">
        <p class="text-secondary flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {member.email}
        </p>
        <p class="text-secondary flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {member.phone}
        </p>
      </div>
      
      <div class="flex gap-3">
        <button 
          class="glass-button flex-1 text-sm py-2 flex items-center justify-center"
          on:click={() => onEdit(member)}
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button 
          class="glass-button flex-1 text-sm py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border-red-400/20 flex items-center justify-center"
          on:click={() => onDelete(member)}
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  {/each}
</div>
