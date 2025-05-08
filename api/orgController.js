import {pool, user} from './connect.js';

// TO DO: view organization's own info
const orgInfo = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM organization_" + user);
    res.send(rows)
};

// TO DO: view members of an organization (with filtering)
const memberInfo = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM ispartof_" + user);
    res.send(rows)
};

// TO DO: view members with unpaid fees for a given semester

// TO DO: view members of a specific committee

export {orgInfo}