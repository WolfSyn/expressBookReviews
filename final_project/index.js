const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", async function auth(req, res, next) {
    //Write the authenication mechanism here
    // Check if user is authenticated
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = await jwt.verify(token, 'thisismysecretkey');
        req.username = decode.username;
        // req.token = token;
        next();
    } catch (error) {

    }
});
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));