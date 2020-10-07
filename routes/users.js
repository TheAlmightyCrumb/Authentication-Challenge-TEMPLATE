const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = '6F772A64291029A8D12';
const REFRESH_TOKEN_SECRET = 'ABA787191032BFF4557';

function generateRefreshToken(name) {
    console.log(name);
    return jwt.sign({ name }, REFRESH_TOKEN_SECRET);
}

function generateAccessToken(name) {
    console.log(name);
    return jwt.sign({ name }, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Token Required' });
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Access Token' });
        req.decoded = decoded;
        next();
    });
}

function useRefreshToken(req, res, next) {
    const { refreshToken } = req.body;
    console.log("refreshTokens:", refreshTokens);
    if (!refreshToken) return res.status(401).json({ message: 'Refresh Token Required' });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Invalid Refresh Token' });
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Refresh Token' });
        req.decoded = decoded;
        next();
    });
}

let USERS = [
    { email: "admin@email.com", name: "Admin", password: "", isAdmin: true },
    { email: "mate@mate.com", name: "Mate", password: "mate123", isAdmin: false },
];

let INFORMATION = [
    { name: 'Admin', info: 'Admin' },
    { name: 'Mate', info: 'Mate' }
];

let refreshTokens = [];

bcrypt.hash("Rc123456!", 10).then(response => {
    const admin = USERS.find(user => user.name === "Admin");
    admin.password = response;
}).catch(e => console.log(e));

let router = Router();

router
.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) return res.status(400).json({ message: 'Invalid Input' });
    if (USERS.some(user => user.email === email)) return res.status(409).json({ message: 'User Already Exists' });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        USERS.push({ email, name, password: hashedPassword });
        INFORMATION.push({ name, info: `${name}Info` });
        return res.status(201).json({ message: 'Register Success' });
    } catch(e) {
        return res.status(500).json({ message: 'An Error Occurred' })
    }
})

.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = USERS.find(user => user.email === email);
    if (!user) return res.status(404).json({ message: 'Cannot find user' });
    if (!bcrypt.compare(password, user.password)) return res.status(403).json({ message: 'User or Password Incorrect' });
    const accessToken = generateAccessToken(user.name);
    const refreshToken = generateRefreshToken(user.name);
    refreshTokens.push(refreshToken);
    console.log('accessToken ', accessToken)
    return res.status(200).json({
        accessToken, refreshToken, userName: user.name, isAdmin: user.isAdmin
    });
})

.post('/tokenValidate', validateToken, async (req, res) => {
    return res.status(200).json({ valid: true });
})

.post('/token', useRefreshToken, async (req, res) => {
    console.log('req.decoded: ', req.decoded);
    const accessToken = generateAccessToken(req.decoded.name);
    return res.status(200).json({ accessToken })
})

.post('/logout', useRefreshToken, async (req, res) => {
    const { refreshToken } = req.body;
    // if (refreshToken === null) return res.status(400).json({ message: 'Refresh Token Required' });
    // console.log("refreshTokens:", refreshTokens);
    // console.log("refreshToken: ", refreshToken);
    // jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    //     if (err) return res.status(400).json({ message: 'Invalid Refresh Token' });
    // });
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    console.log("refreshTokens:", refreshTokens);
    return res.status(200).json({ message: 'User Logged Out Successfully' });
})

module.exports = { router, INFORMATION, USERS, ACCESS_TOKEN_SECRET, validateToken };