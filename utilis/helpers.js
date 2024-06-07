const path = require("path");
const fs = require("fs");

const getRelativeFilePath = (fileName, baseDir = 'uploads') => {
  let relativePath = null;

  const searchFile = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory()) {
        searchFile(fullPath);
      } else if (file === fileName) {
        relativePath = path.relative(baseDir, fullPath);
        break;
      }
    }
  };

  searchFile(baseDir);
  return relativePath;
};


const urlConverter = (relativePath) => {
  const baseUrl = 'http://localhost:5401/uploads/';
  return `${baseUrl}${relativePath.replace(/\\/g, '/')}`;
};

const unlinkFileByFileName = (fileName) => {
  const relativeFilePath = getRelativeFilePath(fileName);
  if (!relativeFilePath) {
    throw new Error('File path not found');
  }
  const fullPath = path.join(__dirname, '..', 'uploads', relativeFilePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  } else {
    throw new Error('File not found on the server');
  }
};

module.exports = {
  urlConverter,
  getRelativeFilePath,
  unlinkFileByFileName,
};
