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
console.log("Member Login test")
needle.post(
    "http://localhost:5000/member/login",
    credentials,
    { json: true },
    (err, res) => {
        console.log(res.body)
    }
);