<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { auth } from '../stores/auth';
  import { setLoading } from '../stores/loading';

  export let requiredType = null;

  onMount(async () => {
    setLoading(true, 'Checking authentication...');
    
    // Check if user is authenticated
    if (!$auth) {
      setLoading(true, 'Redirecting to login...');
      navigate('/login');
      return;
    }

    // Check if user has the required type
    if (requiredType && $auth.type !== requiredType) {
      setLoading(true, 'Redirecting to dashboard...');
      // Redirect based on user type
      if ($auth.type === 'organization') {
        navigate('/organizations');
      } else if ($auth.type === 'member') {
        navigate('/member-fees');
      } else {
        navigate('/home');
      }
      return;
    }

    setLoading(false);
  });
</script>

{#if $auth && (!requiredType || $auth.type === requiredType)}
  <slot />
{/if} 