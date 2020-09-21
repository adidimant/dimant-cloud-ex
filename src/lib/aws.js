const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: "us-east-1" });

const getBucketObject = async (originFileParams) => {
    await s3.getObject(originFileParams).promise();
};

const putObjectInBucket = async (putParams) => {
    await s3.putObject(putParams).promise();
};

const deleteBucketObject = async (originFileParams) => {
    await s3.deleteObject(originFileParams).promise();
};

module.exports = {getBucketObject, putObjectInBucket, deleteBucketObject}