const router = require("express").Router({ mergeParams: true });

router.get('/', async function (req, res, next) {
  const { folderId } = req.params;

  const currentFolderIndex = req.user.folders
    .findIndex((folder) => folder.id === folderId)

  const files = req.user.folders[currentFolderIndex].files;

  res.render('folderFiles', { files });
});


module.exports = router