import needle from "needle";

// Test organization/orgMembers endpoint
var testOrgMember = { role: 'President', committee: 'Executive', batch:'2022B',
                    membership_status:'Active', gender:'F', degree_program: 'BS Statistics'}

// console.log("Find an organization member by attributes")
// needle.post(
//     "http://localhost:5000/organization/orgMembers",
//     testOrgMember,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Test login
var credentials = { username: 'janlevinson', password: 'jl123'}
// console.log("Member Login test")
// needle.post(
//     "http://localhost:5000/member/login",
//     credentials,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Test add fee
var newFee = { fee_id: 'FE-018394', fee_name: 'Service Fee', fee_amount: 120, organization_id: 'MS-101123'}
// console.log("Add fee test")
// needle.post(
//     "http://localhost:5000/organization/addFee",
//     newFee,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Test delete fee
var deleteFee = { fee_id: 'FE-018394'}
// console.log("Delete fee test")
// needle.post(
//     "http://localhost:5000/organization/deleteFee",
//     deleteFee,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Test add transaction
var newPays = { student_number: '2022-04382', fee_id:'FE-101193', issue_date:'2025-05-10', semester_issued:'2S', 
    academic_year_issued: '2024-2025', due_date:'2025-05-23', payment_date: '2025-05-10', payment_status:'Paid',
    semester:'2S', academic_year:'2023-2025'}
// needle.post(
//     "http://localhost:5000/organization/addTransaction",
//     newPays,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Test delete transaction
var deletePays = { transaction_id : '1013'}
// needle.post(
//     "http://localhost:5000/organization/deleteTransaction",
//     deletePays,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Test add status update
var newStatusUpdate = { student_number: '2023-20302', organization_id:'MS-101123', committee:'Publicity', batch:'2025A',
    semester:'2S', academic_year:'2024-2025', date_of_status_update:'2025-05-10', role: 'Assistant Head', membership_status: 'Active'}
// needle.post(
//     "http://localhost:5000/organization/addStatusUpdate",
//     newStatusUpdate,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Test delete status update
var deleteStatusUpdate = { status_update_id: 1018 }
// needle.post(
//     "http://localhost:5000/organization/deleteStatusUpdate",
//     deleteStatusUpdate,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );

// Update fee
var feeUpdate = { fee_id: 'FE-384922', fee_name: '', fee_amount: 50 }
// needle.post(
//     "http://localhost:5000/organization/updateFee",
//     feeUpdate,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );


// Update status update
var statusUpdate = { status_update_id: '1015', committee: '',
                    batch: '', semester: '', academic_year:'', role: 'Social Media Manager', membership_status:'' }
// needle.post(
//     "http://localhost:5000/organization/changeStatusUpdate",
//     statusUpdate,
//     { json: true },
//     (err, res) => {
//         console.log(res.body)
//     }
// );
