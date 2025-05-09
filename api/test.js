import needle from "needle";

// Test organization/orgMembers endpoint
var testOrgMember = { role: 'President', committee: 'Executive', batch:'2022B',
                    membership_status:'Active', gender:'F', degree_program: 'BS Statistics'}

console.log("Find an organization member by attributes")
needle.post(
    "http://localhost:5000/organization/orgMembers",
    testOrgMember,
    { json: true },
    (err, res) => {
        console.log(res.body)
    }
);
