
const express = require("express");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

// MARK OR UPDATE ATTENDANCE
router.post("/mark", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    // Validate request data
    if (
      !mongoose.isValidObjectId(employeeId) ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !["Present", "Absent"].includes(status)
    ) {
      return res.status(400).json({
        message: "Valid employee, date and status are required.",
      });
    }

    // Check that the employee belongs to the logged-in faculty
    const employee = await Employee.findOne({
      _id: employeeId,
      faculty: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    // Create attendance or update existing attendance
    const attendance = await Attendance.findOneAndUpdate(
      {
        faculty: req.user.id,
        employee: employee._id,
        date,
      },
      {
        $set: {
          faculty: req.user.id,
          employee: employee._id,
          date,
          status,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      message: "Attendance saved successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Duplicate attendance record. Please check the attendance indexes.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid attendance data.",
      });
    }

    return res.status(500).json({
      message: "Could not save attendance.",
      error: error.message,
    });
  }
});

// GET ATTENDANCE RECORDS
router.get("/", async (req, res) => {
  try {
    const filter = {
      faculty: req.user.id,
    };

    if (req.query.date) {
      filter.date = req.query.date;
    }

    if (req.query.employeeId) {
      if (!mongoose.isValidObjectId(req.query.employeeId)) {
        return res.status(400).json({
          message: "Invalid employee ID.",
        });
      }

      filter.employee = req.query.employeeId;
    }

    const records = await Attendance.find(filter)
      .populate("employee", "name email department")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json(records);
  } catch (error) {
    console.error("Fetch attendance error:", error.message);

    return res.status(500).json({
      message: "Could not fetch attendance.",
    });
  }
});

// DASHBOARD SUMMARY
router.get("/summary", async (req, res) => {
  try {
    const date =
      req.query.date || new Date().toISOString().slice(0, 10);

    const faculty = req.user.id;

    const [totalEmployees, present, absent] = await Promise.all([
      Employee.countDocuments({ faculty }),
      Attendance.countDocuments({
        faculty,
        date,
        status: "Present",
      }),
      Attendance.countDocuments({
        faculty,
        date,
        status: "Absent",
      }),
    ]);

    return res.status(200).json({
      totalEmployees,
      present,
      absent,
      notMarked: Math.max(0, totalEmployees - present - absent),
      date,
    });
  } catch (error) {
    console.error("Attendance summary error:", error.message);

    return res.status(500).json({
      message: "Could not load attendance summary.",
    });
  }
});

module.exports = router;
