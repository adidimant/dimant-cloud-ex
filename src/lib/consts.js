const PUBLIC_BUCKET_NAME = "dimant-test";
const PRIVATE_BUCKET_NAME = "dimant-test-secured";
const FILE_UPLOADS_TABLE = "file_uploads_log";
const actionContext = {
    client_id: 'dimant-cloud-ex',
    client_display_name: 'incoming-pdf-detector',
}

module.exports = {PUBLIC_BUCKET_NAME, PRIVATE_BUCKET_NAME, FILE_UPLOADS_TABLE, actionContext};