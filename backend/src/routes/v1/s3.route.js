const express = require('express');
const s3Controller = require('../../controllers/s3.controller');


const router = express.Router();

router.post('/getSearchedFiles', s3Controller.getSearchedFiles);

module.exports = router;