const jwt = require("jsonwebtoken");
const env = require("dotenv");
const tokenModel = require("../models/tokenSchemajs");
const userModel = require("../models/userSchema");
const { messages, status } = require("../constants/messages");

env.config();
const auth = async (req, res, next) => {
  try {
    let getBearerToken = req.headers["authorization"];

    if (typeof getBearerToken !== "undefined") {
      let splitToken = getBearerToken.split(" ");
      let token = splitToken[1];

      let findTokenInDb = await tokenModel.findOne({ token: token });
      if (!findTokenInDb) {
        return res.status(401).json({
          success: false,
          message: messages.TOKEN_EXPIRED
        });
      } else {
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (verifyToken && verifyToken.userId) {
          let findUser = await userModel.findById(verifyToken.userId);

          if (!findUser) {
            return res.status(401).json({
              success: false,
              message: messages.USER_NOT_FOUND
            });
          } else {
            req.userId = findUser._id;
            req.userEmail = findUser.email;
            next();
          }
        } else {
          return res.status(401).json({
            success: false,
            message: messages.USER_NOT_AUTHORIZED
          });
        }
      }
    } else {
      return res.status(401).json({
        success: false,
        message: messages.USER_NOT_AUTHORIZED
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = {
  auth,
};
