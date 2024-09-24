const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const prisma = new (require('@prisma/client').PrismaClient)();

const validateFolderCreation = body('name').trim().notEmpty()
  .withMessage('Folder name is required')
  .isAlphanumeric()
  .withMessage('Folder name must contain only letters and numbers');


router.get('/', function (req, res, next) {
  res.render('folder-form');
});

router.post('/', validateFolderCreation, async function (req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // TODO Display errors on the views
    return res.render('folder-form', { errors: result.array() });
  }
  const { name } = req.body;

  try {
    await prisma.folder.create({
      data: {
        name,
        userId: req.user.id
      }
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
})

router.get('/:id', function (req, res, next) {
  res.send('/:id');
});

router.get('/delete/:id', async function (req, res, next) {
  const { id } = req.params;

  // TODO cant delete a folder popup or delete confirmation
  try {
    await prisma.folder.delete({
      where: {
        id: id
      }
    });

    res.redirect('/');

  } catch (err) {
    next(err);
  }

});


module.exports = router;