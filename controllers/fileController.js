const { messages } = require("../constants/messages");
const bucketModel = require("../models/bucketSchema");
const fileModel = require("../models/fileSchema.js");
const { moveFile, clearTempDirectory } = require("../middlewares/multerFileUpload");
const path = require("path");
const { urlConverter, getRelativeFilePath, unlinkFileByFileName } = require("../utilis/helpers");

exports.uploadFile = async (req, res) => {
  try {
    let files = req.files;

    if (files.length !== 1 || files[0].fieldname !== "file") {
      return res.status(400).json({
        success: false,
        message: messages.ONLY_ONE_FILE
      });
    }

    let fileData;



    fileData = {
      fileName: files[0]?.filename,
      fileType: files[0]?.mimetype,
      fileSize: files[0]?.size,
      bucketId: req.body.bucketId,
    };

    const tempDir = path.join(__dirname, '..', 'temp');

    let targetPaths = [];


    req.files.forEach(file => {
      const targetPath = moveFile(file, req.query.bucketName, req.query.folderName);
      targetPaths.push(targetPath);

    });
    let lastCut = targetPaths[0].split('uploads\\')[1];
    let fileUrl = urlConverter(lastCut);

    clearTempDirectory(tempDir);


    const findBucketById = await bucketModel.findOne({
      _id: fileData.bucketId,
      userId: req.userId,
    });

    if (!findBucketById) {
      return res.status(400).json({
        success: false,
        message: messages.BUCKETS_NOT_FOUND
      });
    }

    // Proceed with file upload
    let createFileData = await fileModel.create({
      ...fileData,
      bucketId: findBucketById._id,
    });

    if (!createFileData) {
      return res.status(400).json({
        success: false,
        message: messages.FILE_UPLOAD_FAILURE
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: messages.FILE_UPLOAD_SUCCESS,
      fileUrl: fileUrl
    });
  } catch (error) {
    console.log("error in uploadFileController ", error);
    return res.status(500).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};


exports.retrieveFileList = async (req, res) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: req.body.bucketId,
      userId: req.userId,
    });

    if (!findBucketById) {
      return res.status(400).json({
        success: false,
        message: messages.BUCKETS_NOT_FOUND
      });
    }

    const fileList = await fileModel.find({ bucketId: req.body.bucketId })
      .sort({ createdAt: -1 });

    const filesWithUrls = fileList.map(file => ({
      ...file.toObject(),
      fileUrl: `${req.protocol}://${req.get('host')}/uploads/${file.fileName}`

    }));

    if (filesWithUrls.length === 0) {
      return res.status(200).json({
        success: true,
        message: messages.FILE_FETCH_FAILURE,
        data: []
      });
    } else {
      return res.status(200).json({
        success: true,
        message: messages.FILE_FETCH_SUCCESS,
        data: filesWithUrls
      });
    }
  } catch (error) {
    console.error("Error in getFileListController:", error);
    return res.status(500).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};


exports.getFileById = async (req, res) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: req.body.bucketId,
      userId: req.userId,
    });

    if (!findBucketById) {
      return res.status(400).json({
        success: false,
        message: 'Bucket not found'
      });
    }

    const findFile = await fileModel.findOne({
      _id: req.body.fileId,
      bucketId: req.body.bucketId,
    });

    if (!findFile) {
      return res.status(400).json({
        success: false,
        message: 'File not found'
      });
    } else {
      const fileName = findFile.fileName;
      const relativeFilePath = getRelativeFilePath(fileName);
      if (!relativeFilePath) {
        return res.status(400).json({
          success: false,
          message: 'File path not found'
        });
      }
      const fileUrl = urlConverter(relativeFilePath);
      return res.status(200).json({
        success: true,
        message: 'File fetched successfully',
        data: { ...findFile._doc, fileUrl: fileUrl }
      });
    }
  } catch (error) {
    console.log("error in getFileById ", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: req.body.bucketId,
      userId: req.userId,
    });

    if (!findBucketById) {
      return res.status(400).json({
        success: false,
        message: 'Bucket not found'
      });
    }

    const getFile = await fileModel.findOne({
      _id: req.body.fileId,
      bucketId: findBucketById._id,
    });

    if (!getFile) {
      return res.status(400).json({
        success: false,
        message: 'File already deleted'
      });
    }

    const fileName = getFile.fileName;

    const deleteFile = await fileModel.deleteOne({ _id: req.body.fileId });
    if (!deleteFile) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete file'
      });
    } else {
      unlinkFileByFileName(fileName);
      return res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    }
  } catch (error) {
    console.log("Error in deleteFileController: ", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};