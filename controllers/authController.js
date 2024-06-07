// const { registerUser, loginUser } = require("../services/authService");
// const response = require("responsify-requests");
// const { messages, status } = require("../constants/messages");

// const registerUserController = async (req, res) => {
//   try {
//     const registerService = await registerUser(req.body);
//     console.log("register service ", registerService);
//     if (registerService == 0) {
//       return response(
//         res,
//         {},
//         0,
//         messages.USER_REGISTER_FAILURE,
//         status.BAD_REQUEST
//       );
//     } else if (registerService == 2) {
//       return response(
//         res,
//         {},
//         0,
//         messages.USER_ALREADY_REGISTERED,
//         status.BAD_REQUEST
//       );
//     } else {
//       return response(
//         res,
//         {},
//         true,
//         messages.USER_REGISTER_SUCCESS,
//         status.SUCCESS
//       );
//     }
//   } catch (error) {
//     console.log("error in register controller ", error);
//     return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
//   }
// };

// const loginUserController = async (req, res) => {
//   try {
//     const loginService = await loginUser(req.body);

//     if (loginService == 0) {
//       return response(
//         res,
//         {},
//         0,
//         messages.INVALID_CREDENTIALS,
//         status.UNAUTHORIZED
//       );
//     } else if (loginService == 2) {
//       return response(
//         res,
//         {},
//         0,
//         messages.USER_LOGIN_FAILURE,
//         status.BAD_REQUEST
//       );
//     } else {
//       return response(
//         res,
//         loginService,
//         true,
//         messages.USER_LOGIN_SUCCESS,
//         status.SUCCESS
//       );
//     }
//   } catch (error) {
//     console.log("error in login controller ", error);
//     return response(res, {}, 0, "Internal Server Error");
//   }
// };

// module.exports = {
//   registerUserController,
//   loginUserController,
// };


const userModel = require("../models/userSchema");
const tokenModel = require("../models/tokenSchemajs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const { messages, status } = require("../constants/messages");
env.config();

const registerUser = async (req, res) => {
  try {
    let findDuplicateUser = await userModel.findOne({
      email: req.body.email,
    });

    if (findDuplicateUser) {
      return res.status(400).json({
        success: false,
        message: messages.USER_ALREADY_REGISTERED
      });
    } else {
      const createUser = await userModel.create(req.body);

      if (!createUser) {
        return res.status(400).json({
          success: false,
          message: messages.USER_REGISTER_FAILURE
        });
      } else {
        return res.status(200).json({
          success: true,
          message: messages.USER_REGISTER_SUCCESS
        });
      }
    }
  } catch (error) {
    console.log("error in register user service", error);
    return res.status(500).json({
      success: 0,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let findUser = await userModel.findOne({
      email: req.body.email,
    });

    if (!findUser) {
      return res.status(403).json({
        success: false,
        message: messages.INVALID_CREDENTIALS
      });
    } else {
      let checkPass = await bcrypt.compare(req.body.password, findUser.password);

      if (!checkPass) {
        return res.status(400).json({
          success: false,
          message: messages.INVALID_CREDENTIALS
        });
      } else {
        const generateToken = jwt.sign(
          {
            userId: findUser._id,
            userEmail: findUser.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        if (generateToken) {
          await tokenModel.create({
            token: generateToken,
            userId: findUser._id,
          });

          return res.status(201).json({
            success: true,
            message: messages.USER_LOGIN_SUCCESS,
            data: { ...findUser._doc, token: generateToken }
          });
        } else {
          return res.status(500).json({
            success: false,
            message: messages.USER_LOGIN_FAILURE
          });
        }
      }
    }
  } catch (error) {
    console.log("error in login user service ", error);
    return res.status(500).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
