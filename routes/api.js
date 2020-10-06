const { Router } = require('express');
const { generateAccessToken, generateRefreshToken, validateToken } = require('../token');
const { INFORMATION } = require('./users');

let router = Router();

router
.get('/information', validateToken, async (req, res) => {
    return res.status(200).json({ valid: true });
})

module.exports = router;