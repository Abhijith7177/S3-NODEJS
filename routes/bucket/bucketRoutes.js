const express = require("express");
const router = express.Router();

const {
  createBucketController,
  getBucketsBasedOnUsers,
  editBucket,
  deleteBucket,
  createBucket,
} = require("../../controllers/bucketController");
const { auth } = require("../../middlewares/auth");

router.post("/create", auth, createBucket);
router.get("/retrieve-buckets-user", auth, getBucketsBasedOnUsers);
router.put("/edit", auth, editBucket);
router.delete("/delete", auth, deleteBucket);

module.exports = router;
