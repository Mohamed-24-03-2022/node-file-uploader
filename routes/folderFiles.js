const router = require('express').Router({ mergeParams: true });
const folderFilesController = require('../controllers/folderFilesController');

router.get('/', folderFilesController.renderFolderFiles);

module.exports = router;
