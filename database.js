const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database not connected", error);
    });
};

module.exports = connectDb;
