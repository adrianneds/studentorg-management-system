<script>
  import { Link } from "svelte-routing";
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
  <div class="max-w-md w-full text-center">
    <div class="glass-card p-8">
      <h1 class="text-4xl font-bold text-primary mb-4">404</h1>
      <p class="text-secondary text-xl mb-8">Page not found</p>
      <Link to="/" class="glass-button inline-block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30">
        Go back home
      </Link>
    </div>
  </div>
</div>

<style>
  h1 {
    color: var(--text-primary);
  }
</style> 