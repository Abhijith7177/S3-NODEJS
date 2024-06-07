const messages = {
  // Register specific messages
  USER_REGISTER_FAILURE: "Unable to register the user, Try again",
  USER_ALREADY_REGISTERED: "User already registered",
  USER_REGISTER_SUCCESS: "User registered successfully",

  // Login specific messages
  USER_LOGIN_FAILURE: "Unable to login the user, try again",
  USER_LOGIN_SUCCESS: "User logged-in successfully",
  INVALID_CREDENTIALS: "Invalid credentials",

  // Authentication specific messages
  TOKEN_EXPIRED: "Token expired, Kindly login again",
  USER_NOT_FOUND: "No user found, Kindly register.",
  USER_NOT_AUTHORIZED: "User is not authorized, Kindly login.",

  INTERNAL_SERVER_ERROR: "Internal server error, try again after some time",

  // Bucket specific messages
  BUCKET_CREATE_SUCCESS: "Bucket created successfully",
  BUCKET_CREATE_FAILURE: "Unable to create bucket, try again",
  BUCKET_EXISTS: "Bucket already exists",
  BUCKETS_FETCH_SUCCESS: "Buckets fetched successfully",
  BUCKETS_FETCH_ERROR: "Unable to fetch buckets, Try again",
  BUCKETS_NOT_FOUND: "No buckets found",
  BUCKET_UPDATE_SUCCESS: "Bucket details updated successfully",
  BUCKET_UPDATE_FAILURE: "Unable to update the bucket details, Try again",
  BUCKET_FOUND_ERROR: "Unable to find the bucket",
  BUCKET_DELETE_SUCCESS: "Bucket and its files deleted successfully",
  BUCKET_DELETE_FAILURE: "Unable to delete the bucket, try again",

  // File specific messages
  FILE_UPLOAD_FAILURE: "Unable to upload file, try again",
  FILE_UPLOAD_SUCCESS: "File uploaded successfully",
  FILE_FETCH_SUCCESS: "Files fetched successfully",
  FILE_FETCH_FAILURE: "Unable to fetch the files list",
  FILES_NOT_FOUND: "No files found in bucket.",
  ONLY_ONE_FILE: "Please upload only one file",
  FILE_DELETE_SUCCESS: "File deleted successfully",
  FILE_ALREADY_DELETED: "File is already deleted or not found",
  FILE_DELETE_FAILURE: "Unable to delete the file, try again",
};

const status = {
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  SUCCESS: "SUCCESS",
};

module.exports = {
  messages,
  status,
};
