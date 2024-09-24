const router = require("express").Router();
const prisma = new (require('@prisma/client').PrismaClient)();

router.get('/', function (req, res, next) {
  res.render('folderFiles');
});


module.exports = router