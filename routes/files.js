const router = require('express').Router({ mergeParams: true });
const prisma = new (require('@prisma/client').PrismaClient)();

const fsPath = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const storage = multer.memoryStorage();


const upload = multer({ storage, limits: '2MB', preservePath: true });

router.get('/', async function (req, res, next) {
  res.render('file-form');
});

router.post('/', upload.single('fileUpload'), async function (req, res, next) {
  const { originalname, size } = req.file;
  const folderId = req.body.folderSelect;

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: req.body.folderSelect,
      resource_type: 'auto',
    },
    async (error, uploadRes) => {
      if (error) {
        console.log('Error uploading file', error);
        next(error);
      }

      await prisma.file.create({
        data: {
          name: originalname,
          storageName: uploadRes.display_name,
          folderId,
          url: uploadRes.url,
          size: size,
          userId: req.user.id
        },
      });

      res.redirect(`/folders/${folderId}/files`);
    }
  );

  Readable.from(req.file.buffer).pipe(uploadStream);
});

module.exports = router;
