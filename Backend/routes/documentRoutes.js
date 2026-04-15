const express = require('express');
const router = express.Router();
const { getDocumentHistory } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDocumentHistory);

module.exports = router;