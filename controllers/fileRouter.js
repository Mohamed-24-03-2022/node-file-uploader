const prisma = new (require('@prisma/client').PrismaClient)();
const cloudinary = require('cloudinary').v2;

const asyncHandler = require('express-async-handler');

const getCurrentFileFolderIndex = (req, folderId, fileId) => {
  const currentFolderIndex = req.user.folders.findIndex((folder) => folder.id === folderId);
  const currentFileIndex = req.user.folders[currentFolderIndex].files.findIndex(
    (file) => file.id === fileId
  );

  return { i: currentFolderIndex, j: currentFileIndex };
};

const getFileDetails = async function (req, res, next) {
  const { folderId, fileId } = req.params;
  const { i, j } = getCurrentFileFolderIndex(req, folderId, fileId);
  const file = req.user.folders[i].files[j];
  file.folder = req.user.folders[i];

  res.render('file', { file });
};

const handleFileDelete = asyncHandler(async function (req, res, next) {
  const { folderId, fileId } = req.params;

  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });

  const { i, j } = getCurrentFileFolderIndex(req, folderId, fileId);
  const storageName = req.user.folders[i].files[j].storageName;
  const deleteRes = await cloudinary.api.delete_resources([`${folderId}/${storageName}`]);

  res.redirect(`/folders/${folderId}/files`);
});

module.exports = {
  getFileDetails,
  handleFileDelete,
};
