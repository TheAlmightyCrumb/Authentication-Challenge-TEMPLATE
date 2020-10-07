const { Router } = require('express');
const { INFORMATION, USERS, validateToken } = require('./users');

let router = Router();

router
.get('/information', validateToken, async (req, res) => {
    console.log('req.decoded: ', req.decoded);
    console.log('name: ', req.decoded.name);
    const { name, info } = INFORMATION.find(user => user.name === req.decoded.name);
    return res.status(200).json({ name, info });
})

.get('/users', validateToken, async (req,res) => {
    console.log('req.decoded: ', req.decoded);
    const { isAdmin } = USERS.find(user => user.name === req.decoded.name);
    console.log('isAdmin: ', isAdmin);
    if (isAdmin) return res.status(200).json(USERS);
    return res.status(403).json({  message: 'Need Admin\'s Permissions' });
})

module.exports = router;