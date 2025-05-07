const {pool, user} = require('./connect.js');

// view the member's own info
const memberInfo = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM member_" + user);
  res.send(rows)
};

// view the member's transactions
const memberPays = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM pays_" + user);
  res.send(rows)
};

module.exports = {memberInfo, memberPays}
