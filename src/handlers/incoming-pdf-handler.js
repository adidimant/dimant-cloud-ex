const uuid = require('uuid');
const {PUBLIC_BUCKET_NAME, PRIVATE_BUCKET_NAME, ALERTS} = require("../lib/consts");
const {getBucketObject, putObjectInBucket, deleteBucketObject} = require("../lib/aws");
const {saveFileInfoInDB} = require("../lib/db");

exports.incomingPDFHandler = async (event, context) => {
    console.log("incomingPDFHandler lambda function was triggered!");
    try {
        const fileKey = event.Records[0].s3.object.key;
        let result;

        const originFileParams = {
            Bucket: PUBLIC_BUCKET_NAME,
            Key: fileKey,
        };

        if(!fileKey.endsWith('.pdf')) {
            await deleteBucketObject(originFileParams);
            result = `File: ${fileKey} was deleted due to not-supported format`;
        } else {
            const fileId = uuid();
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
                await putObjectInBucket(putParams);

                const fileInfo = {
                    key: fileId,
                    original_key: fileKey,
                    size: event.Records[0].s3.object.size,
                    type: originFile.ContentType
                };

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
