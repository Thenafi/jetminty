const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();


const credentials = {
    accessKeyId: process.env.TEBI_KEY,
    secretAccessKey: process.env.TEBI_SECRET
};

// Create an S3 service client object.
const s3ClientTebi = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: credentials,
    region: "global"
});


const bucketParamsDoremon: { Bucket: string, Key: string, Body: string, ACL: string } = {
    Bucket: "doremon",
    Key: "OBJECT_NAME",
    Body: "BODY",
    ACL: "public-read"
};


module.exports = { bucketParamsDoremon, s3ClientTebi, PutObjectCommand }