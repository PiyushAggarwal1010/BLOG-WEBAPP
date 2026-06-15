const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      imageUrl: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

module.exports = { uploadImage };