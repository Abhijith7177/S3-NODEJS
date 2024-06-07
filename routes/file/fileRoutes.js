const express = require("express");
const {
  uploadFile,
  retrieveFileList,
  deleteFile,
  getFileById,
} = require("../../controllers/fileController");
const { auth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/multerFileUpload");
const router = express.Router();
router.put("/upload", auth, upload, uploadFile);
router.get("/retrieve", auth, retrieveFileList);
router.get("/get", auth, getFileById);
router.delete("/delete", auth, deleteFile);

module.exports = router;
