const express = require("express");
const router = express.Router();
const { HomeUpdate } = require("../models");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

//////////////// CREATE //////////////////
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const update = new HomeUpdate({
      ...req.body,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });

    await update.save();
    res.json(update);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// GET ALL //////////////////
router.get("/", async (req, res) => {
  const data = await HomeUpdate.find().sort({ createdAt: -1 });
  res.json(data);
});

//////////////// DELETE //////////////////
router.delete("/:id", async (req, res) => {
  try {
    const update = await HomeUpdate.findById(req.params.id);

    if (update.publicId) {
      await cloudinary.uploader.destroy(update.publicId);
    }

    await HomeUpdate.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// UPDATE //////////////////
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const update = await HomeUpdate.findById(req.params.id);

    if (req.file && update.publicId) {
      await cloudinary.uploader.destroy(update.publicId);
    }

    const newData = {
      ...req.body,
      imageUrl: req.file ? req.file.path : update.imageUrl,
      publicId: req.file ? req.file.filename : update.publicId
    };

    const updated = await HomeUpdate.findByIdAndUpdate(
      req.params.id,
      newData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;