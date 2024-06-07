const mongoose = require("mongoose");
const fileModel = require("./fileSchema.js");
const bucketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bucketName: {
      type: String,
      required: true,
      unique: true,
    },
    bucketPath: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// bucketSchema.pre("deleteOne", async function (next) {
//   const currentBucketId = this.getQuery()._id;
//   console.log("currnet ", currentBucketId);
//   await fileModel.deleteMany({
//     bucketId: new mongoose.Types.ObjectId(currentBucketId),
//   });
//   next();
// });

const bucketModel = mongoose.model("buckets", bucketSchema);
module.exports = bucketModel;
