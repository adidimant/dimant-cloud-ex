const lambda = require("../lib/lambda");
const {REGION} = require("../lib/consts");

/*
 Lambda function that triggered by putting a file in public S3 bucket
 The lambda function invoking another (inner) lambda function that operates the actions on the file
*/

exports.incomingPDFHandler = async (event, context) => {
    console.log("primalPDFHandler lambda function was triggered!");
    try {
        let response = await lambda.invoke(event, "innerPDFHandler", REGION);
        console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
};
