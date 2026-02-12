const express = require('express');
const router = express.Router();
const { getAlerts } = require('../services/alertService');

router.get('/', (req, res) => {
    res.json(getAlerts());
});

module.exports = router;
