<script>
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';
  import { navigate, Link } from 'svelte-routing';

  onMount(() => {
    if ($auth) {
      if ($auth.type === 'organization') {
        navigate('/organizations');
      } else if ($auth.type === 'member') {
        navigate('/member-dashboard');
      }
    }
  });
</script>

<div class="h-[calc(100vh-6rem)] flex items-center justify-center py-8">
  <div class="w-full max-w-4xl px-4">
    <div class="glass-card p-8 text-center">
      <h1 class="text-4xl font-bold text-primary mb-4">Student Organization Management System</h1>
      <p class="text-secondary text-lg mb-8">Manage your student organizations and memberships efficiently</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/login" class="glass-button py-3 px-8 text-lg">
          Sign In
        </Link>
        <Link to="/register" class="glass-button py-3 px-8 text-lg">
          Register
        </Link>
      </div>
    </div>
  </div>
</div>

<style>
  h1 {
    color: var(--text-primary);
  }
</style>