const { Router } = require('express');
const { validateToken } = require('../token');
const { INFORMATION, USERS } = require('./users');

let router = Router();

router
.get('/information', validateToken, async (req, res) => {
    console.log('req.decoded: ', req.decoded);
    const { name, info } = INFORMATION.find(user => user.name === req.decoded.name);
    return res.status(200).json({ name, info });
})

.get('/users', validateToken, async (req,res) => {
    console.log('req.decoded: ', req.decoded);
    const { isAdmin } = USERS.find(user => user.name === req.decoded.name);
    if (isAdmin) return res.status(200).json({ USERS });
    return res.status(403).json({  message: 'Need Admin\'s Permissions' });
})

module.exports = router;