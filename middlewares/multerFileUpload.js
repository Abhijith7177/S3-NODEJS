
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const tempDir = path.join(__dirname, '..', 'temp');
    // if (!fs.existsSync(tempDir)) {
    //   fs.mkdirSync(tempDir, { recursive: true });
    // }
    cb(null, 'temp');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).any();

const getAllFolderPaths = (dir, folderPaths = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      folderPaths.push(fullPath);
      getAllFolderPaths(fullPath, folderPaths);
    }
  });

  return folderPaths;
};

const moveFile = (file, bucketName, folderName) => {
  let destination = path.join(__dirname, '..', 'uploads', bucketName);

  if (folderName) {
    const allFolders = getAllFolderPaths(path.join(__dirname, '..', 'uploads'));

    let matchedFolder = null;
    for (const folder of allFolders) {
      const parts = folder.split(path.sep);
      const folderBucketName = parts[3];
      const folderFolderName = parts[parts.length - 1];

      if (folderBucketName === bucketName && folderFolderName === folderName) {
        matchedFolder = folder;
        break;
      }
    }

    if (matchedFolder) {
      destination = matchedFolder;
    } else {
      throw new Error("Matching folder not found.");
    }
  }

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const targetPath = path.join(destination, path.basename(file.path));
  fs.renameSync(file.path, targetPath);

  return targetPath;
};


const clearTempDirectory = (tempDir) => {
  const files = fs.readdirSync(tempDir);
  for (const file of files) {
    const filePath = path.join(tempDir, file);
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  upload,
  moveFile,
  clearTempDirectory
};


