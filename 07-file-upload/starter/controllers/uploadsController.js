const path = require('path');

const { StatusCodes } = require('http-status-codes');
const Error = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// copy image to the `public` static folder stored on server
const uploadLocal = async (req, res) => {
  if (!req.files) {
    throw new Error.BadRequestError('No File Uploaded');
  }

  let image = req.files.image;
  if (!image.mimetype.startsWith('image')) {
    throw new Error.BadRequestError('Please Upload Image');
  }

  const maxSize = 1024 * 1025; // 1 MB
  if (image.size > maxSize) {
    throw new Error.BadRequestError(`Image should be smaller than ${maxSize}`);
  }
  const imagePath = path.join(__dirname, '../public/uploads/' + image.name);
  await image.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: { src: `/uploads/${image.name}` } });
};

const upload = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: 'file-upload-tutorial'
  });

  // remove temp file after uploading to cloudinary
  fs.unlinkSync(req.file.image.tempFilePath);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
}

module.exports = { upload };