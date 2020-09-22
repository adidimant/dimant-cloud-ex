// Import mock AWS SDK from aws-sdk-mock
const AWS = require('aws-sdk-mock');

describe('Test for s3-json-logger', () => {
    // This test invokes the s3-json-logger Lambda function and verifies that the received payload is logged
    it('Verifies the object is read and the payload is logged', async () => {
        const objectBody = '{"Test": "PASS"}';
        const getObjectResponse = { Body: objectBody };
        AWS.mock('S3', 'getObject', (params, callback) => {
            callback(null, getObjectResponse);
        });

        // Mock console.log statements so we can verify them. For more information, see
        // https://jestjs.io/docs/en/mock-functions.html
        console.log = jest.fn();

        // Create a sample payload with S3 message format
        const event = {
            Records: [
                {
                    s3: {
                        bucket: {
                            name: 'aws-us-east-1-722379266774-dimant-cloud-ex-simpleappbucket',
                        },
                        object: {
                            key: 'test-key',
                            size: 300
                        },
                    },
                },
            ],
        };

        // Import all functions from s3-json-logger.js. The imported module uses the mock AWS SDK
        const incomingPDFHandler = require('../../../src/handlers/incoming-pdf-handler.js');
        await incomingPDFHandler.incomingPDFHandler(event, null);

        // Verify that console.log has been called with the expected payload
        expect(console.log).toHaveBeenCalledWith(objectBody);

        AWS.restore('S3');
    });
});
