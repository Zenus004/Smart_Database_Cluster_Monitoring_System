const express = require('express');
const router = express.Router();
const { getClusterStatus } = require('../controllers/monitorController');

router.get('/status', getClusterStatus);

module.exports = router;
