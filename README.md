AWS S3 clone using nodejs,express and mongoDB

User register and login API walkthrough

register - POST - http://localhost:5000/api/auth/register
User register using email and password and username

login - POST - http://localhost:5000/api/auth/login
User logins using email and password and the token for authentication is send in response

createBucket - POST - http://localhost:5000/api/bucket/create
User creates a bucket using bucketName and if required multiple folder kindof structure can use path in the req.body.
Initially BucketName for creating the buckets and then if folder is needed inside the bucket path key can also be send.
Note : path should be the parent folder name

getBucket - GET - http://localhost:5000/api/bucket/retrieve-buckets-user
Get all user related buckets

getBucket - PUT - http://localhost:5000/api/bucket/edit
Edit bucket give bucketName and bucketId in the body

deleteBucket - DELETE - http://localhost:5000/api/bucket/delete
Delete bucket with bucketId to be given in the body

putObject - PUT - http://localhost:5000/api/file/upload?bucketName=bucket
User add objects to the bucket and/or files using the bucketName which should be updated with the new object
and if there is a folder created already we can provide a folderName key in req.query also so this gets updated
also in req.body the same bucketId for the bucketName should be given.

getObjects - GET - http://localhost:5000/api/file/retrieve
User can get all the Objects from the bucket using bucketId in req.body

getObjects - GET - http://localhost:5000/api/file/get
User can get one of the Object from the bucket using bucketId and fileId in req.body

getObjects - DELETE - http://localhost:5000/api/file/delete
User can get one of the Object from the bucket using bucketId and fileId in req.body
