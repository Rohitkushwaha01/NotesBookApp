require("dotenv").config();
const jwt = require('jsonwebtoken');

const fetchuser = async (req, res, next)=> {
    const token = await req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token, process.env.JWTSECRET)
        req.user = data.user;
        next();
    }
    catch(error){
        res.status(401).send({errors: "Please authenticate using a valid token"});
    }
}

module.exports = fetchuser;