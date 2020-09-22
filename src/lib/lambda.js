const aws = require("aws-sdk");
const defaultRegion = "eu-central-1";

const createAsyncInvocationParams = (functionName, args) => {
  let invokeArgs = Buffer.from(JSON.stringify(args));
  return {
    FunctionName: functionName,
    InvokeArgs: invokeArgs,
  };
};

const invokeAsync = (args, functionName, region = defaultRegion) => {
  let lambda = new aws.Lambda({ region });
  const params = createAsyncInvocationParams(functionName, args);
  return new Promise((resolve, reject) => {
    lambda.invokeAsync(params).on("complete", result => {
      resolve();
    }).send();
  })
};

const createInvocationParams = (args, functionName) => {
  let payload = Buffer.from(JSON.stringify(args));
  return {
    FunctionName: functionName,
    Payload: payload
  };
};

const createInvocationPromise = (lambda, params) => {
  return new Promise((resolve, reject) => {
    lambda.invoke(params, (err, data) => {
      if (err || data.FunctionError) {
        reject(err || data.Payload);
      } else {
        resolve(JSON.parse(data.Payload));
      }
    });
  });
};

const invoke = (args, functionName, region = defaultRegion) => {
  let lambda = new aws.Lambda({ region });
  const params = createInvocationParams(args, functionName);
  return createInvocationPromise(lambda, params);
};

module.exports = {
  invoke,
  invokeAsync
};