const jwt = require("jsonwebtoken");
const JWT_SIGN = process.env.JWT_SIGN;

const fetchAdmin = (req, res, next) => {
    //Getting token of Admin in header and checking for valid token
    const token = req.header("auth-token");
    if(!token)
    {
        res.status(401).send({error:"Please authenticate using valid token"})
    }
    try
    {
        const data = jwt.verify(token, JWT_SIGN);
        req.admin = data.admin;
        next();
    }
    catch(error)
    {
        res.status(401).send({error:"Please authenticate using valid token"})
    }
}

module.exports = fetchAdmin;