<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    // let semAYPending = {ay:'2023-2024', sem:'2S'};
    // let semAYLate = {ay:'2023-2024', sem:'2S'};
    let sem = "2S";
    let ay = "2023-2024"
    let status = "unpaid";
    let ayInput = "";
    let members = [];
    let semDebt = "2S";
    let ayDebt = "2023-2024";
    let ayInputDebt = "";
    let memberDebt = [];

    function validateAY(ayIn) {
         if ( isNaN(parseInt(ayIn.slice(0,4))) || isNaN(parseInt(ayIn.slice(4,9)))  
            || ayIn[4] != '-' || parseInt(ayIn[3]) != parseInt(ayIn[8]) -1 ) {
            alert("Invalid Academic Year");
            return
        } else {
            return true
        }
    }

    function updateSemAY(statusIn, semIn, ayIn) {
        if (!validateAY(ayIn)) {
            return
        }
        sem = semIn;
        ay = ayIn;
        status = statusIn;
        console.log(sem)
        console.log(ay)
        console.log(status)
        if (status == "unpaid") {
            getMembersUnpaid();
        } else if (status == "late") {
            getMembersLate();
        }
    }

    function updateSemAYDebt(semIn, ayIn) {
        if (!validateAY(ayIn)) {
            return
        }
        semDebt = semIn
        ayDebt = ayIn;
        console.log(semDebt); console.log(ayDebt)
        getMemberHighestDebt();
    }

    // NEW: getting username
    var username = JSON.parse(localStorage.getItem('user')).organization_username
    console.log(username)

    // NEW: import member with unpaid fees data from db server
    async function getMembersUnpaid() {
      await fetch(`http://localhost:5000/organization/unpaidMembers/user/${username}?sem=${sem}&ay=${ay}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        members = data;
        console.log(members);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    // NEW: import member with late payments from db server
    async function getMembersLate() {
      await fetch(`http://localhost:5000/organization/latePayments/user/${username}?sem=${sem}&ay=${ay}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        members = data;
        console.log(members);
      }).catch(error => {
        console.log(error);
        return [];
      });
    };

    // NEW: import member with highest debt from db server
    async function getMemberHighestDebt() {
      await fetch(`http://localhost:5000/organization/highestDebt/user/${username}?sem=${semDebt}&ay=${ayDebt}`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => response.json())
      .then(data => {
        memberDebt = data;
        console.log(memberDebt);
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
        getMembersUnpaid();
        getMemberHighestDebt();
    });

</script> 
    
<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
<div class="max-w-7xl mx-auto h-full flex flex-col">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2"> {status=='unpaid'? 'Unpaid Fees' : 'Late Payments'} </h1>
        <p class="text-secondary"> View members with {status=='unpaid'? 'unpaid fees issued at a semester/academic year' : 'late payments made during a semester/academic year'} </p>
    </div>

    <div class="mb-8">

        <!-- Dropdown menu -->
        <button id="statusDropdown" data-dropdown-toggle="dropdown2" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            {status.toUpperCase()}
        <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
        </button>
        <div id="dropdown2" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateSemAY("unpaid", sem ,ay)}>Unpaid</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateSemAY("late",sem, ay)}>Late</a>
            </li>
            </ul>
        </div>

        <!-- Dropdown menu -->
        <button id="semDropdown" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            {sem}
        <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
        </button>
        <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateSemAY(status, "1S",ay)}>1st Semester</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateSemAY(status,"2S",ay)}>2nd Semester</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={updateSemAY(status, "M",ay)}>Midyear</a>
            </li>
            </ul>
        </div>
        
    </div>

    <div class = "mb-8">
    <div class="w-full max-w-sm min-w-[200px]">
        <div class="relative">
            <input id = "AYInput" type="email" class="w-full bg-transparent placeholder:text-slate-600 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="{status == 'unpaid' ? 'A.Y. Issued' : 'A.Y. Paid'} e.g., 2023-2024" bind:value={ayInput} />
            <button id = "AYsubmitButton"
            class="absolute right-1 top-1 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button" on:click={updateSemAY(status,sem,ayInput)}
            >
            Submit
            </button>
        </div>
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
                    Transaction ID
                </th>
                <th scope="col" class="px-6 py-3">
                    Fee Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Fee Amount
                </th>
                <th scope="col" class="px-6 py-3">
                    Payment Status
                </th>
                <th scope="col" class="px-6 py-3">
                    Semester / Academic Year Issued
                </th>
                <th scope="col" class="px-6 py-3">
                    Semester / Academic Year Paid
                </th>
            </tr>
        </thead>
        {#each members as member}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {member.student_number}
                </th>
                <td class="px-6 py-4">
                    {member.member_name}
                </td>
                <td class="px-6 py-4">
                    {member.transaction_id}
                </td>
                <td class="px-6 py-4">
                    {member.fee_name}
                </td>
                <td class="px-6 py-4">
                    {member.fee_amount}
                </td>
                <td class="px-6 py-4">
                    {member.payment_status}
                </td>
                <td class="px-6 py-4">
                    {member.semester_issued} / {member.academic_year_issued}
                </td>
                <td class="px-6 py-4">
                    {member.semester == null ? "N/A"  : member.semester + " " + member.academic_year} 
                </td>
            </tr>
        {/each}
    </table>
</div>
</div>

<div class="max-w-7xl mx-auto h-full flex flex-col">
    <div class="mb-8">
        <a name = "debt"> </a>
        <h1 class="text-3xl font-bold text-primary mb-2"> Highest Debtor </h1>
        <p class="text-secondary"> Member with highest debt as of a given semester/academic year </p>
    </div>

    <!-- Dropdown menu -->
    <div class = "mb-8">
    <button id="semDropdown2" data-dropdown-toggle="dropdown3" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        {semDebt}
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="dropdown3" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li>
            <a href="#debt" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateSemAYDebt("1S",ayDebt)}>1st Semester</a>
        </li>
        <li>
            <a href="#debt" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={() => updateSemAYDebt("2S",ayDebt)}>2nd Semester</a>
        </li>
        <li>
            <a href="#debt" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" on:click={updateSemAYDebt("M",ayDebt)}>Midyear</a>
        </li>
        </ul>
    </div>
    </div>

    <div class = "mb-8">
    <div class="w-full max-w-sm min-w-[200px]">
        <div class="relative">
            <input id = "AYInput" type="email" class="w-full bg-transparent placeholder:text-slate-600 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="e.g., 2023-2024" bind:value={ayInputDebt} />
            <button id = "AYsubmitButton"
            class="absolute right-1 top-1 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button" on:click={updateSemAYDebt(semDebt, ayInputDebt)}
            >
            Submit
            </button>
        </div>
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
                    Amount Due
                </th>
            </tr>
        </thead>

    {#each memberDebt as member}
    <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {member.student_number}
        </th>
        <td class="px-6 py-4">
            {member.member_name}
        </td>
        <td class="px-6 py-4">
            {member.debt}
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

    #semDropdown, #semDropdown2 {
    color: black;
    background-color: var(--text-primary)
  }

  #AYInput {
    background-color: white;
    color:var(--primary)
  }

   #AYsubmitButton {
    background-color: var(--primary);
   }

   #statusDropdown {
    background-color: var(--primary)
   }

</style>