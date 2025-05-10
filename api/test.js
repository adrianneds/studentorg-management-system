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