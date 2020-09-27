const { v4: uuidv4 } = require('uuid');
const {ALERTS} = require("../lib/consts");
const {getBucketObject, putObjectInBucket, deleteBucketObject} = require("../lib/aws");
const {saveFileInfoInDB} = require("../lib/db");
const {queryObjectKeyToString} = require("../utils");
const PUBLIC_BUCKET_NAME = process.env.PUBLIC_BUCKET, PRIVATE_BUCKET_NAME = process.env.PRIVATE_BUCKET;

exports.innerHandler = async (event, context) => {
    console.log("innerPDFHandler lambda function was triggered!");
    try {
        const fileKey = queryObjectKeyToString(event.Records[0].s3.object.key);
        let result;

        let originFileParams = {
            Bucket: PUBLIC_BUCKET_NAME,
            Key: fileKey,
        };
        console.log(`originFileParams - ${JSON.stringify(originFileParams)}`);

        if(!fileKey.endsWith('.pdf')) {
            await deleteBucketObject(originFileParams);
            result = `File: ${fileKey} was deleted due to not-supported format`;
        } else {
            const fileId = uuidv4();
            const originFile = await getBucketObject(originFileParams);
            if(!originFile) console.log(`${ALERTS.COULDNT_GET_FILE} - ${fileKey}`);
            else {
                const putParams = {
                    Bucket: PRIVATE_BUCKET_NAME,
                    Key: fileId,
                    Body: originFile.Body,
                    ContentType: originFile.ContentType,
                    Metadata: originFile.Metadata,
                    StorageClass: "INTELLIGENT_TIERING"
                };
                console.log(`putParams - ${JSON.stringify(putParams)}`);
                await putObjectInBucket(putParams);

                const fileInfo = {
                    key: fileId,
                    original_key: fileKey,
                    size: Math.round(event.Records[0].s3.object.size),
                    type: originFile.ContentType
                };
                console.log(`fileInfo - ${JSON.stringify(fileInfo)}`);

                await saveFileInfoInDB(fileInfo);

                result = `File: ${fileKey} was successfully renamed and moved to the private bucket`;
            }
        }
        console.log(result);
      return { statusCode: 200, result: result };
    } catch (error) {
      console.error(error);
      throw error;
    }
};
