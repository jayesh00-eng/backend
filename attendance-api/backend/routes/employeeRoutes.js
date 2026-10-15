
const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

function validId(id) {
  return mongoose.isValidObjectId(id);
}

// ADD EMPLOYEE
router.post("/", async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name?.trim() || !email?.trim() || !department?.trim()) {
      return res.status(400).json({
        message: "Name, email and department are required.",
      });
    }

    const employee = await Employee.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: req.body.phone || "",
      department: department.trim(),
      designation: req.body.designation || "",
      joiningDate: req.body.joiningDate || "",
      faculty: req.user.id,
    });

    return res.status(201).json({
      message: "Employee added successfully.",
      employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This employee email already exists.",
      });
    }

    console.error("Add employee error:", error.message);

    return res.status(500).json({
      message: "Could not add employee.",
    });
  }
});

// GET ALL EMPLOYEES / SEARCH EMPLOYEES
router.get("/", async (req, res) => {
  try {
    const filter = { faculty: req.user.id };
    const search = req.query.search?.trim();

    if (search) {
      // Escape special regex characters entered in search
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { department: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const employees = await Employee.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Fetch employees error:", error.message);

    return res.status(500).json({
      message: "Could not fetch employees.",
    });
  }
});

// UPDATE EMPLOYEE
router.put("/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid employee ID.",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "department",
      "designation",
      "joiningDate",
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty.",
        });
      }

      updates.name = updates.name.trim();
    }

    if (updates.email !== undefined) {
      if (!updates.email.trim()) {
        return res.status(400).json({
          message: "Email cannot be empty.",
        });
      }

      updates.email = updates.email.trim().toLowerCase();
    }

    if (updates.department !== undefined) {
      if (!updates.department.trim()) {
        return res.status(400).json({
          message: "Department cannot be empty.",
        });
      }

      updates.department = updates.department.trim();
    }

    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        faculty: req.user.id,
      },
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      message: "Employee updated successfully.",
      employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This employee email already exists.",
      });
    }

    console.error("Update employee error:", error.message);

    return res.status(500).json({
      message: "Could not update employee.",
    });
  }
});

// DELETE EMPLOYEE AND THEIR ATTENDANCE
router.delete("/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid employee ID.",
      });
    }

    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      faculty: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    await Attendance.deleteMany({
      employee: employee._id,
      faculty: req.user.id,
    });

    return res.status(200).json({
      message: "Employee and associated attendance deleted successfully.",
    });
  } catch (error) {
    console.error("Delete employee error:", error.message);

    return res.status(500).json({
      message: "Could not delete employee.",
    });
  }
});

module.exports = router;
