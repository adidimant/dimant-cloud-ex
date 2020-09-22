const REGION = "us-east-1";
const FILE_UPLOADS_TABLE = "file_uploads_log";
const actionContext = {
    client_id: 'dimant-cloud-ex',
    client_display_name: 'incoming-pdf-detector',
}

const ALERTS = {
    COULDNT_GET_FILE: "Couldn't get file from public bucket"
}

module.exports = {REGION, FILE_UPLOADS_TABLE, actionContext, ALERTS};