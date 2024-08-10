const express = require('express');
const cors = require('cors'); 
const router = require('./router/authrouter'); 
const company = require('./router/company');

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use("/company", company);

app.listen(6000, () => {
    console.log('Server is running on port 6000');
});