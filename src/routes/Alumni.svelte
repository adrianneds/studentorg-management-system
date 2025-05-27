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

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> Alumni Members </h1>
        <p class="text-secondary"> View alumni members as of a given date </p>
    </div>

    <div class="mb-8">
        <div class="date-container glass-card p-6">
      <input class = "dateInput text-input" type="date" min="1970-01-01" bind:value={alumniDateInput} />
      <button class = "date-input-submit" id = "submitButton" type="button" on:click={()=>{alumniDate=alumniDateInput;getAlumni()}}> Submit </button>
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

</style>