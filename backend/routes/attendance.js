const express = require("express");
const router = express.Router();
const { Attendance } = require("../models");

//////////////// CREATE //////////////////
router.post("/", async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      date: new Date(req.body.date)
    });

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// GET ALL //////////////////
router.get("/", async (req, res) => {
  try {
    const { date, sector, village, status } = req.query;
    let filter = {};
    
    if (date) {
      filter.date = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      };
    }
    
    if (sector) {
      filter.sector = sector;
    }
    
    if (village) {
      filter.village = village;
    }
    
    if (status) {
      filter.status = status;
    }

    const data = await Attendance.find(filter).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// GET BY ID //////////////////
router.get("/:id", async (req, res) => {
  try {
    const data = await Attendance.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// UPDATE //////////////////
router.put("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { ...req.body, date: new Date(req.body.date) },
      { new: true }
    );
    
    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// DELETE //////////////////
router.delete("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
