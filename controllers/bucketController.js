const bucketModel = require("../models/bucketSchema");
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");
const file = require("../models/fileSchema.js");
const { messages } = require("../constants/messages");

// exports.createBucket = async (req, res) => {
//   try {

//     const userId = req.userId;

//     const checkIfBucketExists = await bucketModel.findOne({
//       bucketName: req.body.bucketName,
//       userId: userId,
//     });

//     if (checkIfBucketExists) {
//       return res.status(400).json({
//         success: false,
//         message: messages.BUCKET_EXISTS
//       });
//     } else {
//       const create = await bucketModel.create({ ...req.body, userId: userId });

//       if (!create) {
//         return res.status(400).json({
//           success: false,
//           message: messages.BUCKET_CREATE_FAILURE
//         });
//       } else {
//         return res.status(200).json({
//           success: true,
//           message: messages.BUCKET_CREATE_SUCCESS
//         });
//       }
//     }
//   } catch (error) {
//     console.log("error in create bucket controller, ", error);
//     return res.status(500).json({
//       success: false,
//       message: messages.INTERNAL_SERVER_ERROR
//     });
//   }
// };

exports.getBucketsBasedOnUsers = async (req, res) => {
  try {
    const userId = req.userId;

    const getBuckets = await bucketModel.find({
      userId: userId,
    });

    if (!getBuckets) {
      return res.status(400).json({
        success: false,
        message: messages.BUCKETS_FETCH_ERROR
      });
    } else if (getBuckets.length === 0) {
      return res.status(200).json({
        success: true,
        message: messages.BUCKETS_NOT_FOUND,
        data: []
      });
    } else {
      return res.status(200).json({
        success: true,
        message: messages.BUCKETS_FETCH_SUCCESS,
        data: getBuckets
      });
    }
  } catch (error) {
    console.log("error in listing bucket controller, ", error);
    return res.status(500).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};

exports.editBucket = async (req, res) => {
  try {
    const userId = req.userId;

    const findBucketById = await bucketModel.findOne({
      _id: req.body.bucketId,
      userId: userId,
    });

    if (!findBucketById) {
      return res.status(400).json({
        success: false,
        message: messages.BUCKETS_NOT_FOUND
      });
    } else {
      const updateBucket = await bucketModel.updateOne(
        { _id: req.body.bucketId },
        { bucketName: req.body.bucketName },
        { new: true }
      );

      if (!updateBucket) {
        return res.status(400).json({
          success: false,
          message: messages.BUCKET_UPDATE_FAILURE
        });
      } else {
        return res.status(200).json({
          success: true,
          message: messages.BUCKET_UPDATE_SUCCESS
        });
      }
    }
  } catch (error) {
    console.log("error in update bucket controller ", error);
    return res.status(500).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};

exports.deleteBucket = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.userId;
    const bucketId = req.body.bucketId;

    // Find the bucket by ID
    const findBucketById = await bucketModel.findOne({
      _id: bucketId,
      userId: userId,
    }).session(session);

    if (!findBucketById) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: messages.BUCKETS_NOT_FOUND
      });
    }

    // Delete associated files
    const deleteFiles = await file.deleteMany({ bucketId: bucketId }).session(session);

    if (!deleteFiles) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: messages.FILES_DELETE_FAILURE
      });
    }

    // Delete the bucket
    const deleteBucket = await bucketModel.deleteOne({ _id: bucketId }).session(session);

    if (!deleteBucket) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: messages.BUCKET_DELETE_FAILURE
      });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: messages.BUCKET_DELETE_SUCCESS
    });
  } catch (error) {
    console.error("Error in delete bucket controller:", error);

    // Rollback changes
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};





function getAllPaths(directoryPath, paths = []) {
  const items = fs.readdirSync(directoryPath);
  items.forEach(item => {
    const itemPath = path.join(directoryPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      paths.push(itemPath); // Add the directory path to the array
      getAllPaths(itemPath, paths); // Recursively get subfolders
    }
  });
  return paths;
}

exports.createBucket = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reqBody = req.body;
    const userId = req.userId;
    const bucketName = reqBody.bucketName;
    const customPath = reqBody.path;

    let destination = 'uploads';
    const allFolders = getAllPaths(destination);
    console.log("🚀 ~ exports.createBucketController= ~ allFolders:", allFolders)
    console.log("🚀 ~ exports.createBucketController= ~ allFolders:", allFolders.map(item => item.split('\\')).flat(Infinity))
    const allFoldersNew = new Set(allFolders.map(item => item.split('\\')).flat(Infinity));
    // Check if bucket name is unique across all folders
    if (allFoldersNew.has(bucketName)) {
      return res.status(400).json({
        success: false,
        message: "Bucket with the same name already exists.",
      });
    }
    if (customPath) {

      function patchFolderPath(allFolders, customPath, bucketName) {
        const customPathName = path.basename(customPath);

        for (let i = 0; i < allFolders.length; i++) {
          const parts = allFolders[i].split(path.sep);
          const folderName = parts[parts.length - 1];
          if (folderName === customPathName) {
            return allFolders[i] + '\\' + bucketName;
          }
        }

        return null; // Return null if no matching folder found
      }
      // If custom path is provided, update the destination accordingly
      destination = patchFolderPath(allFolders, customPath, bucketName);
      if (!destination) {
        throw new Error(`Failed to update the destination for the custom path "${customPath}".`);
      }
    }

    // Check if the bucket already exists in the final destination path
    let bucketPath = path?.join('uploads', bucketName);
    if (customPath) {

      bucketPath = path.join(destination);
      if (fs.existsSync(bucketPath)) {
        throw new Error("Bucket with the same name already exists in the specified path.");
      }
    }

    // Create the bucket record in the database
    const create = await bucketModel.create([{ ...reqBody, userId: userId }], { session });

    if (!create) {
      throw new Error(messages.BUCKET_CREATE_FAILURE);
    }

    // Create the directory for the bucket
    fs.mkdirSync(bucketPath, { recursive: true });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: messages.BUCKET_CREATE_SUCCESS,
    });
  } catch (error) {
    console.error("Error in create bucket controller:", error);

    // Rollback changes
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message || messages.INTERNAL_SERVER_ERROR,
    });
  }
};