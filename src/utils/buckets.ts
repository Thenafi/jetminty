const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
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




const listOfObjectsInBucket = async function (bucketName: string, prefix: string) {
    const params = {
        Bucket: bucketName,
        Prefix: prefix
    };
    const data = await s3ClientTebi.send(new ListObjectsV2Command(params));
    if (data.Contents === undefined) return [];
    // returns the key by last modified date in descending order
    return data.Contents.sort((a: any, b: any) => b.LastModified - a.LastModified).map((item: any) => item.Key);
}



module.exports = { bucketParamsDoremon, s3ClientTebi, PutObjectCommand, listOfObjectsInBucket }