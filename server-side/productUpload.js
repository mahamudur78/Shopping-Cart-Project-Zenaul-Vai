const uploader = require("./singleUploader");

function productUpload(req, res, next) {
  // console.log('upload Image ',req.body);
  const upload = uploader(
    "productImgs",
    ["image/jpeg", "image/jpg", "image/png"],
    10000000,
    "Only .jpg, jpeg or .png format allowed!"
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          productImg: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = productUpload;
