<script>
    import { Link } from 'svelte-routing';
    import { onMount, afterUpdate } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { Dropdown, initFlowbite } from 'flowbite';

    let sem = "2S";
    let ay = "2023-2024"
    let status = "unpaid";
    let ayInput = "";
    let members = [];
    let membersAsOf = [];
    let semDebt = "2S";
    let ayDebt = "2023-2024";
    let ayInputDebt = "";
    let memberDebt = [];

    let showUnpaidMembers = true;
    let showHighestDebtor = false;

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
        } else if (status == 'unpaidAsOf') {
            getMembersUnpaidAsOf();
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
    // var username = JSON.parse(localStorage.getItem('user')).organization_username
    // console.log(username)

    // NEW: import member with unpaid fees data from db server
    async function getMembersUnpaidAsOf() {
      await fetch(`http://localhost:5001/organization/unpaidMembersAsOf/user/${$auth.organization_id}?sem=${sem}&ay=${ay}`,
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

    // NEW: import member with unpaid fees data from db server
    async function getMembersUnpaid() {
      await fetch(`http://localhost:5001/organization/unpaidMembers/user/${$auth.organization_id}?sem=${sem}&ay=${ay}`,
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
      await fetch(`http://localhost:5001/organization/latePayments/user/${$auth.organization_id}?sem=${sem}&ay=${ay}`,
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
      await fetch(`http://localhost:5001/organization/highestDebt/user/${$auth.organization_id}?sem=${semDebt}&ay=${ayDebt}`,
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

    afterUpdate(() => {
        initFlowbite();
    });

</script> 

<div class="h-[calc(100vh-6rem)] py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-4 mb-2">
        <Link to="/organization-dashboard" class="glass-button text-sm py-2 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
        </Link>
    </div>
    <br>

    <div class="options-container">
        <div class="options">
            <button class = "glass-button options-button" on:click={() => {showUnpaidMembers=true;showHighestDebtor=false;}}>
                Late and Unpaid Fees
            </button>
            <button class = "glass-button options-button" on:click={() => {showUnpaidMembers=false;showHighestDebtor=true;}}>
                Highest Debtor
            </button>
        </div>
    </div>

    {#if showUnpaidMembers}
    <div class="max-w-7xl mx-auto h-full flex flex-col">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2">
                {#if status === 'unpaid'}
                    Unpaid Fees for Semester or Academic Year
                {:else if status === 'unpaidAsOf'}
                    Unpaid Fees as of Semester or Academic Year
                {:else if status === 'late'}
                    Late Payments
                {/if}
            </h1>
            <p class="text-secondary">
                {#if status === 'unpaid'}
                    View members who have not paid their fees for the selected semester/academic year
                {:else if status === 'unpaidAsOf'}
                    View members who have unpaid fees accumulated up to the selected semester/academic year
                {:else if status === 'late'}
                    View members who made late payments during the selected semester/academic year
                {/if}
            </p>
        </div>

        <div class="mb-8">

            <!-- Dropdown menu -->
            <button id="statusdropdown" data-dropdown-toggle="dropdown-status"
            class="glass-dropdown" type="button">
                Status
            <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
            </button>
            <div id="dropdown-status"
            class="dropdown-options z-10 hidden">
                <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a href="#" class="block px-4 py-2" on:click={() => updateSemAY("unpaid", sem ,ay)}>Unpaid for Sem/AY Fees</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2" on:click={() => updateSemAY("unpaidAsOf",sem, ay)}>Unpaid as of Sem/AY</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2" on:click={() => updateSemAY("late",sem, ay)}>Late</a>
                </li>
                </ul>
            </div>

            <!-- Dropdown menu -->
            <button id="semDropdown" data-dropdown-toggle="dropdown-sem"
            class="glass-dropdown" type="button">
                {sem}
            <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
            </button>
            <div id="dropdown-sem"
            class="dropdown-options z-10 hidden">
                <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a href="#" class="block px-4 py-2" on:click={() => updateSemAY(status, "1S",ay)}>1st Semester</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2" on:click={() => updateSemAY(status,"2S",ay)}>2nd Semester</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2" on:click={updateSemAY(status, "M",ay)}>Midyear</a>
                </li>
                </ul>
            </div>
            
        </div>

        <div class = "mb-8">
            <div class="flex flex-row">
                <div class="w-full max-w-sm min-w-[200px]">
                    <div class="relative">
                        <input id = "AYInput" class="glass-input w-full bg-transparent placeholder:text-white text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="{status === 'unpaid' ? 'A.Y. Issued' : status === 'unpaidAsOf' ? 'A.Y. as of' : 'A.Y. Paid'} e.g., 2023-2024" bind:value={ayInput} />
                    </div>
                </div>
                <button id = "AYsubmitButton"
                    class="glass-button text-sm py-2 px-4 ml-2 flex items-center justify-center"
                    type="button" on:click={updateSemAY(status,sem,ayInput)}
                    >
                    Submit
                </button>
            </div>
        </div>

        <div class="relative overflow-x-auto">
        <table class="glass-table">
            <thead>
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
            <tbody>
            {#each members as member}
                <tr>
                    <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
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
            </tbody>
        </table>
    </div>

    </div>
    {/if}

    {#if showHighestDebtor}
    <div class="max-w-7xl mx-auto h-full flex flex-col">
        <div class="mb-8">
            <a name = "debt"> </a>
            <h1 class="text-3xl font-bold text-primary mb-2"> Highest Debtor </h1>
            <p class="text-secondary"> Member with highest debt as of a given semester/academic year </p>
        </div>

                <!-- <button id="semDropdown" data-dropdown-toggle="dropdown-sem"
            class="glass-dropdown" type="button">
                {sem}
            <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
            </button>
            <div id="dropdown-sem"
            class="dropdown-options z-10 hidden">
                <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a href="#" class="block px-4 py-2" on:click={() => updateSemAY(status, "1S",ay)}>1st Semester</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2" on:click={() => updateSemAY(status,"2S",ay)}>2nd Semester</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2" on:click={updateSemAY(status, "M",ay)}>Midyear</a>
                </li>
                </ul>
            </div> -->

        <!-- Dropdown menu -->
        <div class = "mb-8">
        <button id="semDropdown2" data-dropdown-toggle="sem-debt"
        class="glass-dropdown" type="button">
            {semDebt}
        <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
        </button>
        <div id="sem-debt" class="dropdown-options z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
            <ul class="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
            <li>
                <a href="#debt" class="block px-4 py-2" on:click={() => updateSemAYDebt("1S",ayDebt)}>1st Semester</a>
            </li>
            <li>
                <a href="#debt" class="block px-4 py-2" on:click={() => updateSemAYDebt("2S",ayDebt)}>2nd Semester</a>
            </li>
            <li>
                <a href="#debt" class="block px-4 py-2" on:click={updateSemAYDebt("M",ayDebt)}>Midyear</a>
            </li>
            </ul>
        </div>
        </div>

        <div class = "mb-8">
            <div class="flex flex-row">
                <div class="w-full max-w-sm min-w-[200px]">
                    <div class="relative">
                        <input id = "AYInput" class="glass-input w-full bg-transparent placeholder:text-white text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="e.g., 2023-2024" bind:value={ayInputDebt} />
                    </div>
                </div>
                <button id =  "AYsubmitButton"
                    class="glass-button text-sm py-2 px-4 ml-2 flex items-center justify-center"
                    type="button" on:click={updateSemAYDebt(semDebt, ayInputDebt)}
                    >
                    Submit
                </button>
            </div>
        </div>

        <div class="relative overflow-x-auto">
        <table class="glass-table">
            <thead>
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
            <tbody>
            {#each memberDebt as member}
                <tr>
                    <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
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
            </tbody>
        </table>
        </div>
    </div>
    {/if}


</div>

<style>
  h1 {
    color: var(--text-primary);
  }

  .glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    transition: all 0.3s ease;
    border-radius: 0.375rem;
  }

  .glass-button:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .options-container {
    margin-bottom: 2rem;
  }

  .options {
    display: flex;
    gap: 1rem;
  }

  .options-button {
    padding: 0.5rem 1rem;
  }

  .text-input {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    transition: all 0.3s ease;
  }

  .text-input:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .text-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

/* 
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
   } */

</style>