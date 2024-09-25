const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const prisma = new (require('@prisma/client').PrismaClient)();
const asyncHandler = require('express-async-handler');

const validateFolderCreation = body('name').trim().notEmpty()
  .withMessage('Folder name is required')
  .isAlphanumeric()
  .withMessage('Folder name must contain only letters and numbers');


router.get('/', function (req, res, next) {
  res.render('folder-form');
});

router.post('/', validateFolderCreation, asyncHandler(async function (req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // TODO Display errors on the views
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
  res.send('/:id');
});

router.get('/delete/:id', asyncHandler(async function (req, res, next) {
  // TODO cant delete a folder popup or force delete confirmation

  const { id } = req.params;
  await prisma.folder.delete({
    where: {
      id: id
    }
  });

  res.redirect('/');
}));


module.exports = router;