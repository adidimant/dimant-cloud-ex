const lambda = require("../lib/lambda");
const {REGION} = require("../lib/consts");

exports.incomingPDFHandler = async (event, context) => {
    console.log("incomingPDFHandler lambda function was triggered!");
    try {
        let response = await lambda.invoke(event, "innerPDFHandler", REGION);
        console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
};
