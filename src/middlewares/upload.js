import multer from 'multer';
import { tmpdir } from 'node:os';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: tmpdir(),
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(createHttpError(400, 'Please upload only images.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
