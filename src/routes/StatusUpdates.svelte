<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let statusUpdates = [];

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    console.log(username)

    // NEW: import member with late payments from db server
    async function getStatusUpdates() {
      await fetch(`http://localhost:5000/organization/viewStatusUpdates/user/${username}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        statusUpdates = data;
        console.log(statusUpdates);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    onMount(async () => {
        if (!$auth || $auth.type !== 'organization') {
            navigate('/login');
            return;
        }
        initFlowbite();
        getStatusUpdates();
    });

</script> 


<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> Status Updates </h1>
        <p class="text-secondary"> View all status updates from organization members </p>
    </div>

    <!-- `SELECT student_number, committee, batch, semester,
    academic_year, date_of_status_update, role, membership_status FROM is_part_of 
    NATURAL JOIN organization WHERE organization_username = '${user}';` -->

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
                    Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Sem/AY
                </th>
                <th scope="col" class="px-6 py-3">
                    Committee
                </th>
                <th scope="col" class="px-6 py-3">
                    Batch
                </th>
                <th scope="col" class="px-6 py-3">
                    Role
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
            </tr>
        </thead>
        {#each statusUpdates as row}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {row.student_number}
                </th>
                <td class="px-6 py-4">
                    {row.member_name}
                </td>
                <td class="px-6 py-4">
                    {row.date_of_status_update.slice(0,10)}
                </td>
                <td class="px-6 py-4">
                    {row.semester}/{row.academic_year}
                </td>
                <td class="px-6 py-4">
                    {row.committee}
                </td>
                <td class="px-6 py-4">
                    {row.batch}
                </td>
                <td class="px-6 py-4">
                    {row.role}
                </td>
                <td class="px-6 py-4">
                    {row.membership_status}
                </td>
            </tr>
        {/each}
    </table>
</div>
</div>

</div>