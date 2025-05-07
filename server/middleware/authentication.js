const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if(!token)
        return res.status(401).json({message: "Authentication required!"});
    try{
        const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedInfo;
        next();
    }
    catch(error)
    {
        console.log(error);
        res.status(401).json({message : "Invalid or Expired token"})
    }
}

module.exports = authentication;