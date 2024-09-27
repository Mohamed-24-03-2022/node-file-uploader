const asyncHandler = require('express-async-handler');
const prisma = new (require('@prisma/client').PrismaClient)();

const handleSearch = asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  const foldersSearchRes = await prisma.folder.findMany({
    where: {
      userId: req.user.id,
      name: {
        contains: search,
      },
    },
  });

  const filesSearchRes = await prisma.file.findMany({
    where: {
      userId: req.user.id,
      name: {
        contains: search,
      },
    },
  });

  res.render('search', { files: filesSearchRes, folders: foldersSearchRes });
});

module.exports = { handleSearch };
