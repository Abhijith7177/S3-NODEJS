require("dotenv").config();

const envConstants = {
  nodePort: process.env.PORT,
  mongoDbConnectionUrl: process.env.MONGO_ATLAS_DB_URL,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = envConstants;
