const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = '6F772A64291029A8D12';
const REFRESH_TOKEN_SECRET = 'ABA787191032BFF4557';

function generateRefreshToken(email) {
    console.log(email);
    return jwt.sign({ email }, REFRESH_TOKEN_SECRET);
}

function generateAccessToken(email) {
    console.log(email);
    return jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: '40s' });
}

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({ message: 'Access Token Required' });
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Access Token' });
        req.decoded = decoded;
        next();
    });
}

module.exports = { generateAccessToken, generateRefreshToken, validateToken };
