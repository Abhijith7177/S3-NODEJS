const express = require("express");
const router = express.Router();
const authRoutes = require("./auth/authRoutes");
const bucketRoutes = require("./bucket/bucketRoutes");
const fileRoutes = require("./file/fileRoutes");

router.use("/auth", authRoutes);
router.use("/bucket", bucketRoutes);
router.use("/file", fileRoutes);

module.exports = router;
