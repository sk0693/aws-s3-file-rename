const express = require('express');
const s3Route = require('./s3.route');

const router = express.Router();

router.use('/s3', s3Route);

module.exports = router;
