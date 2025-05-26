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

<div class="home-container h-[calc(100vh-6rem)] flex flex-row py-8">
  <div class="left-col">
    <div class="logo"> 
      <img src='src\assets\logo.png' alt="" class="home-logo">
      <div class="desc">
        <p class="desc">
          Streamlining student organization operations. Made by students, for students.
        </p>
      </div>
    </div>
    <Link to="/login" class="mt-8 glass-button py-3 px-8 text-lg self-start">
          Sign In
    </Link>
  </div>
  <div class="right-col">
    <img src="src\assets\screenshots.png" alt="" class="ml-10 mt-8 home-screenshots">
  </div>
</div>


<!-- <div class="h-[calc(100vh-6rem)] flex items-center justify-center py-8">
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
</div> -->

<style>
  h1 {
    color: var(--text-primary);
  }
</style>