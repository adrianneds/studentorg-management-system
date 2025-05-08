import express from "express";
import cors from "cors";
import {memberRouter} from './routes/members.js'
import {orgRouter} from './routes/organizations.js'

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/member", memberRouter); // to be able to use the imported routes for requests
app.use("/organization", orgRouter); // to be able to use the imported routes for requests

// Start server
const port = 5000;
app.listen(port, (err) => {
    if (err) { console.log(err) }
    else console.log(`Server started on port ${port}`);
});