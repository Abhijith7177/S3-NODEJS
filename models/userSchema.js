const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let genSalt = 10;
  let hashedPass = await bcrypt.hash(this.password, genSalt);
  this.password = hashedPass;
  next();
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
