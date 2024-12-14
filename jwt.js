const jwt = require("jsonwebtoken");

const jwtMiddleWare = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(404).json({ massage: "Token Not Found" });

    const token = authorization.split(" ")[1];
    if (!token) return res.status(404).json({ err: "Unautherized" });


    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }

}

const generateToken = (userdata) => {
    return jwt.sign(userdata, process.env.JWT_SECRET, { expiresIn: 30000 });
}

module.exports = { jwtMiddleWare, generateToken };