"use strict";
const router = require("express").Router();
const user = require("../../app/controller/user");
const devotees = require("../../app/controller/devotees");
const isAuthenticated = require("./../../middlewares/isAuthenticated");

// auth routes
router.post("/login", user.login);
router.post("/signUp", user.signUp);
router.post(
  "/profile/changePassword",
  isAuthenticated(["USER", "PROVIDER"]),
  user.changePasswordProfile
);
router.post("/getProfile", user.getProfile);
router.post("/updateProfile", user.updateProfile);

//devotees
router.post("/get-devotees", devotees.getDevotees);
router.post("/save-attendance", devotees.saveAttendance);
router.post("/get-attendance", devotees.getAttendance);
router.post("/get-Allattendance", devotees.getAllAttendance);
router.post("/get-bydate", devotees.formatedAttendance);

module.exports = router;
