const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = 400;
      return next(error);
    }

    res.json({
      imageUrl: req.file.path,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };