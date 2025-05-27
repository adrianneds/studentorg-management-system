<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let alumniDate = "2024-01-01";
    let alumniMembers = [];
    let alumniDateInput = "";
    
    function incrementDate(dateString) {
        const date = new Date(dateString);
        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        return adjustedDate.toISOString().slice(0,10);
    }

    // NEW: fetch alumni data from db server
    async function getAlumni() {
      await fetch(`http://localhost:5001/organization/alumni/user/${$auth.organization_id}?date=${alumniDate}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        alumniMembers = data;
        console.log(alumniMembers);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    function changeDate(date) {
        date = incrementDate(date)
        console.log(date)
        alumniDate = date;
        getAlumni();
    }


    onMount(async () => {
        if (!$auth || $auth.type !== 'organization') {
            navigate('/login');
            return;
        }
        getAlumni();
    });

</script> 
    
<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="flex items-center gap-4 mb-2">
        <Link to="/organization-dashboard" class="glass-button text-sm py-2 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
        </Link>
    </div>
    <br>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> Alumni Members </h1>
        <p class="text-secondary"> View alumni members as of a given date </p>
    </div>

    <div class="mb-8">
        <div class="glass-card p-6">
            <div class="flex items-center gap-4">
                <div class="flex-1">
                    <input 
                        class="glass-input" 
                        type="date" 
                        min="1970-01-01" 
                        bind:value={alumniDateInput}
                    />
                </div>
                <button 
                    class="glass-button text-sm py-2 flex items-center justify-center" 
                    type="button" 
                    on:click={()=>{alumniDate=alumniDateInput;getAlumni()}}
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Submit
                </button>
            </div>
        </div>
    </div>

    <div class="glass-table-container">
    <table class="glass-table">
        <thead>
            <tr>
                <th scope="col">
                    Student Number
                </th>
                <th scope="col">
                    Name
                </th>
                <th scope="col">
                    Degree Program
                </th>
                <th scope="col">
                    Batch
                </th>
                <th scope="col">
                    Latest Status Update
                </th>
            </tr>
        </thead>
        <tbody>
        {#each alumniMembers as member}
            <tr>
                <th scope="row">
                    {member.student_number}
                </th>
                <td>
                    {member.member_name}
                </td>
                <td>
                    {member.degree_program}
                </td>
                <td>
                    {member.batch}
                </td>
                <td>
                    {incrementDate(member.date_of_status_update)}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
</div>


</div>

<style>
  h1 {
    color: var(--text-primary);
  }

  input[type="date"] {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.75rem 1rem;
    width: 100%;
    transition: all 0.3s ease;
  }

  input[type="date"]:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-clear-button {
    filter: invert(1);
  }

  .glass-label {
    @apply text-blue-100 font-medium mb-2 block;
  }
</style>