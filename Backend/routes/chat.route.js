const express = require('express');
const router = express.Router();
const { chatWithDocument } = require('../controllers/chat.controller');

router.post('/documents/:id/chat', chatWithDocument);

module.exports = router;