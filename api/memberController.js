import {pool, user} from './connect.js';

// view the member's own info
const memberInfo = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM member_" + user);
  res.send(rows)
};

// view the member's transactions
const memberPays = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM feepays_" + user);
  res.send(rows)
};

// TO DO: view the member's organizations

export {memberInfo, memberPays}


//

// {
//   id: 1,
//   name: 'Annual Membership Fee',
//   amount: 500,
//   dueDate: '2024-03-15',
//   status: 'paid',
//   paymentMethod: 'GCash',
//   paymentDate: '2024-02-01'
// },