const router = require("express").Router();



const foldersRouter = require('../controllers/foldersRouter');

router.get('/', foldersRouter.renderFolderForm);

router.post('/', foldersRouter.handleAddFolder);

router.get('/:id', foldersRouter.getFolderFiles);

router.get('/delete/:id', foldersRouter.handleDeleteFolder);


module.exports = router;