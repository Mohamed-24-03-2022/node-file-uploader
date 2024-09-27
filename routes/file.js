const router = require('express').Router({ mergeParams: true });
const fileRouter = require('../controllers/fileRouter');

router.get('/', fileRouter.getFileDetails);

router.post('/', fileRouter.handleFileDelete);

module.exports = router;
