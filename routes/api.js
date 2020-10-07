const { Router } = require('express');
const { generateAccessToken, generateRefreshToken, validateToken } = require('../token');
const { INFORMATION } = require('./users');

let router = Router();

router
.get('/information', validateToken, async (req, res) => {
    console.log('req.decoded: ', req.decoded);
    const { name, info } = INFORMATION.find(user => user.name === req.decoded.name)
    return res.status(200).json({ name, info });
})

module.exports = router;