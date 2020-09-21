const piDb = require('@fibotax/pi-db');
const postgrestUrl = 'http://postgrest-elb-1032081051.us-east-1.elb.amazonaws.com:3000';
const db = new piDb(postgrestUrl);

const {FILE_UPLOADS_TABLE, actionContext} = require("../lib/consts");

const saveFileInfoInDB = async (fileInfo) => {
    const payload = {
        ...fileInfo,
        timestamp: Date.now()
    };
    await db.create(FILE_UPLOADS_TABLE, actionContext, payload);
};

module.exports = { saveFileInfoInDB };