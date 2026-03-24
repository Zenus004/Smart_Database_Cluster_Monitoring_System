const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// potentially add authMiddleware here

router.post('/stop', adminController.stopContainer);
router.post('/start', adminController.startContainer);
router.post('/restart', adminController.restartContainer);
router.post('/provision', adminController.provisionReplica);

module.exports = router;
