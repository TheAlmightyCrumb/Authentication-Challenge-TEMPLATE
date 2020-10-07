const { Router } = require('express');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, validateToken, useRefreshToken } = require('../token');

let router = Router();

let USERS = [
    { email: "admin@email.com", name: "Admin", password: "", isAdmin: true }
];

let INFORMATION = [
    { name: 'Admin', info: 'Admin' }
];

bcrypt.hash("Rc123456!", 10).then(response => {
    const admin = USERS.find(user => user.name === "Admin");
    admin.password = response;
}).catch(e => console.log(e));

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

.get('/', async (req, res) => {
    res.json(USERS);
})

module.exports = { router, INFORMATION };