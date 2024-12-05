const express = require('express');
const router = express.Router();
//middlewares
const auth = require('../../middleware/decryptToken');
const {isStudent} = require('../../middleware/checkRole');


module.exports = router;