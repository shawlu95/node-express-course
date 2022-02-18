### File Upload
* File is stored on server
* DB object has a `image` field that points to where image is located
* In postman, select `Body`, `form-data`, select `File` instead of `Text` for param
* Use `express-fileupload` for file upload (accept uploaded file)
  - access file in `req.files.foo`
* Use cloudinary npm package to store image in cloud
* Best practice: remove temp file after upload