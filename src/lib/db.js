const piDb = require('@fibotax/pi-db');
const moment = require('moment-timezone');
//const postgrestUrl = 'http://postgrest-elb-1032081051.us-east-1.elb.amazonaws.com:3000';
const postgrestUrl = `http://postgrest-${process.env.ENV}.local:3000`;
const db = new piDb(postgrestUrl);

const {FILE_UPLOADS_TABLE, actionContext} = require("../lib/consts");

const saveFileInfoInDB = async (fileInfo) => {
    console.log("ENV - " + process.env.ENV);
    const payload = {
        ...fileInfo,
        timestamp: moment().tz('Asia/Jerusalem').format('YYYY-MM-DD HH:mm:ss')
    };
    await db.create(FILE_UPLOADS_TABLE, actionContext, payload);
};

module.exports = { saveFileInfoInDB };