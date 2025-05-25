<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let transactions = [];

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    console.log(username)

    // NEW: import member with late payments from db server
    async function getTransactions() {
      await fetch(`http://localhost:5000/organization/viewTransactions/user/${username}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        transactions = data;
        console.log(transactions);
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
        getTransactions();
    });

</script> 


<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> Transactions </h1>
        <p class="text-secondary"> View all transactions from organization members </p>
    </div>

<!-- transaction_id, student_number, fee_id, fee_amount, fee_name issue_date, semester_issued,
    academic_year_issued, due_date, payment_date, payment_status, semester, academic_year -->

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Transaction id
                </th>
                <th scope="col" class="px-6 py-3">
                    Student Number
                </th>
                <th scope="col" class="px-6 py-3">
                    Member Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Fee ID
                </th>
                <th scope="col" class="px-6 py-3">
                    Fee Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Payment Status
                </th>
                <th scope="col" class="px-6 py-3">
                    Issue date
                </th>
                <th scope="col" class="px-6 py-3">
                    Sem/AY issued
                </th>
                <th scope="col" class="px-6 py-3">
                    Due date
                </th>
                <th scope="col" class="px-6 py-3">
                    Payment status
                </th>
                <th scope="col" class="px-6 py-3">
                    Payment date
                </th>
            </tr>
        </thead>
        {#each transactions as transaction}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {transaction.transaction_id}
                </th>
                <td class="px-6 py-4">
                    {transaction.student_number}
                </td>
                <td class="px-6 py-4">
                    {transaction.member_name}
                </td>
                <td class="px-6 py-4">
                    {transaction.fee_id}
                </td>
                <td class="px-6 py-4">
                    {transaction.fee_name}
                </td>
                <td class="px-6 py-4">
                    {transaction.payment_status}
                </td>
                <td class="px-6 py-4">
                    {transaction.issue_date.slice(0,10)}
                </td>
                <td class="px-6 py-4">
                    {transaction.semester_issued}/{transaction.academic_year_issued}
                </td>
                <td class="px-6 py-4">
                    {transaction.due_date.slice(0,10)}
                </td>
                <td class="px-6 py-4">
                    {transaction.payment_status}
                </td>
                <td class="px-6 py-4">
                    {transaction.payment_date == null ? 'N/A' : transaction.payment_date.slice(0,10)}
                </td>
            </tr>
        {/each}
    </table>
</div>
</div>

</div>