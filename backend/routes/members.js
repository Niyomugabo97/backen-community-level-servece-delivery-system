const express = require("express");
const router = express.Router();
const { Member } = require("../models");

//////////////// CREATE //////////////////
router.post("/", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// GET ALL //////////////////
router.get("/", async (req, res) => {
  try {
    const { sector, village, role, status } = req.query;
    let filter = {};
    
    if (sector) {
      filter.sector = sector;
    }
    
    if (village) {
      filter.village = village;
    }
    
    if (role) {
      filter.role = role;
    }
    
    if (status) {
      filter.insuranceStatus = status;
    }

    const data = await Member.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// GET BY ID //////////////////
router.get("/:id", async (req, res) => {
  try {
    const data = await Member.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// UPDATE //////////////////
router.put("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////// DELETE //////////////////
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
