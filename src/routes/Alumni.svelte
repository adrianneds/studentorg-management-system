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

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Student Number
                </th>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Degree Program
                </th>
                <th scope="col" class="px-6 py-3">
                    Batch
                </th>
                <th scope="col" class="px-6 py-3">
                    Latest Status Update
                </th>
            </tr>
        </thead>
        {#each alumniMembers as member}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {member.student_number}
                </th>
                <td class="px-6 py-4">
                    {member.member_name}
                </td>
                <td class="px-6 py-4">
                    {member.degree_program}
                </td>
                <td class="px-6 py-4">
                    {member.batch}
                </td>
                <td class="px-6 py-4">
                    {incrementDate(member.date_of_status_update)}
                </td>
            </tr>
        {/each}
    </table>
</div>
</div>


</div>

<style>
  h1 {
    color: var(--text-primary);
  }

</style>