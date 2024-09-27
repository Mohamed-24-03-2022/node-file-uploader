const router = require('express').Router({ mergeParams: true });

const filesRouter = require('../controllers/filesRouter');

router.get('/', filesRouter.renderFileForm);

router.post('/', filesRouter.handleUploadFile);

module.exports = router;
