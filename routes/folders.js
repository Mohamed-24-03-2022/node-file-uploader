const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const prisma = new (require('@prisma/client').PrismaClient)();
const asyncHandler = require('express-async-handler');

const validateFolderCreation = body('name').trim().notEmpty()
  .withMessage("Folder name can't be empty")

router.get('/', function (req, res, next) {
  res.render('folder-form');
});

router.post('/', validateFolderCreation, asyncHandler(async function (req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render('folder-form', { errors: result.array() });
  }
  const { name } = req.body;

  await prisma.folder.create({
    data: {
      name,
      userId: req.user.id
    }
  });

  res.redirect('/');
}));

router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  res.redirect(`/folders/${id}/files`);
});

router.get('/delete/:id', asyncHandler(async function (req, res, next) {

  const { id } = req.params;
  prisma.folder.delete({
    where: {
      id: id
    }
  }).then(() => {
    res.redirect('/');
  })
    .catch((err) => {
      if (err.code === 'P2003')
        err.message = "Cant' delete a folder with existing files"
      res.redirect(`/?errorMessage=${err.message}`);
    })

}));


module.exports = router;